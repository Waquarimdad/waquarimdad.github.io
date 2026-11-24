/* ==========================================================
   Posts. Add a new object to POSTS to publish an article.
   Body is lightweight Markdown:
     ## / ### headings, paragraphs, - / 1. lists, **bold**, *italic*,
     \`inline code\`, [link](url), ~~~lang fenced code, | tables |,
     > !tldr ...   > !note ...   > !warn ...  callouts,
     :::fig <name>   inline diagram,   :::demo <name>  interactive demo.
   (Inside this file, write inline-code backticks as \` .)
   ========================================================== */
window.POSTS = [
{
  slug: "idempotency-keys-pay-once",
  title: "Pay once means once: idempotency keys for money-moving APIs",
  dek: "Retries are not an edge case. In payments and lending they are the normal path, and the API has to be designed so that the second call is boring.",
  date: "2026-11-10",
  tags: ["payments", "api-design", "postgres", "kafka"],
  featured: true,
  body: `
> !tldr The client sends a key, the server stores the key *and the response* in the same transaction as the side effect, and every retry with that key replays the stored response. Everything else is detail — but the details are where duplicate charges come from.

## Why this matters more than it looks

In a lending or BNPL flow, a single user tap can fan out into a lot of network hops: app → gateway → order service → ledger → a partner bank. Every one of those hops can time out *after* the work succeeded. The caller has no way to know, so it retries. Mobile clients retry, load balancers retry, Kafka redelivers, and an engineer replays a failed batch on Monday morning.

If the endpoint that moves money is not idempotent, every one of those retries is a potential second disbursement or a second debit. "Exactly once" is not something the network gives you — you build it at the edges of your system.

:::fig idempotency

## The contract

The client generates a unique \`Idempotency-Key\` (a UUID is fine) per *logical operation* — not per HTTP attempt. The server promises:

1. The first request with a key does the work and records the outcome.
2. Any later request with the same key and the same payload gets the **same response**, without doing the work again.
3. A request with the same key but a **different payload** is rejected with \`422\` — that is a client bug, and silently accepting it hides it.
4. A request that arrives while the first one is still running gets \`409\` (or waits), never a second execution.

## The table

~~~sql
CREATE TABLE idempotency_keys (
  key           text        PRIMARY KEY,
  request_hash  text        NOT NULL,
  status        text        NOT NULL,      -- IN_PROGRESS | COMPLETED
  response_code int,
  response_body jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  locked_until  timestamptz
);
~~~

The primary key does the heavy lifting. Two concurrent requests with the same key race on an \`INSERT\`, and Postgres guarantees exactly one wins.

## The flow in Spring

~~~java
@Transactional
public ApiResponse charge(String key, ChargeRequest req) {
    String hash = Hashing.sha256(req.canonicalJson());

    int inserted = jdbc.update("""
        INSERT INTO idempotency_keys (key, request_hash, status, locked_until)
        VALUES (?, ?, 'IN_PROGRESS', now() + interval '30 seconds')
        ON CONFLICT (key) DO NOTHING
        """, key, hash);

    if (inserted == 0) {
        IdemRecord existing = repo.findForUpdate(key);   // SELECT ... FOR UPDATE
        if (!existing.requestHash().equals(hash)) {
            throw new UnprocessableEntity("Idempotency-Key reused with a different payload");
        }
        if (existing.isCompleted()) {
            return existing.storedResponse();             // replay, do nothing
        }
        throw new Conflict("A request with this key is still in progress");
    }

    // Side effect and the record of it commit together — or not at all.
    Payment p = ledger.debit(req.accountId(), req.amount());
    ApiResponse res = ApiResponse.created(p);
    repo.complete(key, res.code(), res.body());
    return res;
}
~~~

The important line is the comment near the bottom. If the debit and the "I did it" record live in **the same database transaction**, there is no window where one exists without the other.

## When the side effect is not in your database

Usually the interesting step is a call to someone else — a payment gateway, a partner bank. You cannot put their system in your transaction. Three habits make this survivable:

- **Pass your key downstream.** Most serious payment APIs accept an idempotency key. Derive theirs from yours (\`key + ":gateway"\`) so a retry of your request is also a retry of theirs.
- **Record intent before the call.** Write \`PENDING\` with the downstream reference first, then call, then move to \`SUCCEEDED\` / \`FAILED\`. A crash in the middle leaves a row you can find.
- **Treat a timeout as UNKNOWN, not FAILED.** Reconcile it later by asking the downstream for the status of that reference. Marking it failed and letting the user retry is exactly how double charges happen.

> !warn A timeout means "I don't know", not "it didn't happen". Model it as its own state.

## Consumers need it too

Kafka gives you at-least-once delivery by default. A consumer that commits its offset after processing will, at some point, process a message twice — after a rebalance, a crash, or a deploy. The same idea applies: store the event ID in a \`processed_events\` table inside the transaction that applies the effect, and skip duplicates.

~~~java
@KafkaListener(topics = "repayments")
@Transactional
public void on(RepaymentEvent e) {
    if (processed.insertIfAbsent(e.eventId()) == 0) return;   // seen it
    loans.applyRepayment(e.loanId(), e.amount());
}
~~~

## What to expire, and when

Keys do not need to live forever — they need to outlive the longest retry window of any client. A day is common for public APIs; a few days is safer if humans replay batches. Expire with a scheduled delete on \`created_at\`, and keep the downstream reference on the payment row itself so reconciliation does not depend on the key table.

## Checklist

- The key is per logical operation, generated by the client.
- Key + payload hash are checked; mismatches are rejected loudly.
- The effect and the stored response commit in one transaction.
- Downstream calls carry a derived key.
- Timeouts become \`UNKNOWN\` and get reconciled, never auto-failed.
- Consumers dedupe on event ID, not on "it probably won't happen".
`
},
{
  slug: "rate-limiting-redis-token-bucket",
  title: "Rate limiting with Redis: token bucket vs sliding window, with a live demo",
  dek: "Two algorithms, one Lua script each, and a simulator you can poke to see why bursts behave the way they do.",
  date: "2026-10-22",
  tags: ["redis", "rate-limiting", "distributed-systems"],
  demo: true,
  body: `
> !tldr Use a **token bucket** when you want to allow short bursts but cap the average rate. Use a **sliding window** when "no more than N in any 60 seconds" must hold strictly. In Redis, do the check-and-update in one Lua script so it is atomic across all your app instances.

## The problem with a counter

The first rate limiter everyone writes is \`INCR key\` with an \`EXPIRE\` of 60 seconds. It works until someone notices the boundary: a client can send N requests at 00:59 and another N at 01:00 — **2N in two seconds** — and the limiter is happy. Fixed windows are cheap, but they are not what product managers think "100 per minute" means.

## Token bucket, intuitively

Picture a bucket that holds at most \`capacity\` tokens. Tokens drip in at \`refill\` per second. Every request takes one token; if the bucket is empty, the request is rejected. A quiet client builds up a full bucket and can spend it in a burst; a busy client is held to the refill rate.

Try it — crank the traffic past the refill rate and watch the bucket drain, then pause and watch it recover.

:::demo token-bucket

## Token bucket in Redis

You do not need a background job to drip tokens. Store the token count and the timestamp of the last update, and compute the refill lazily on each request.

~~~lua
-- KEYS[1] = bucket key
-- ARGV: capacity, refill_per_sec, now_ms, cost
local cap    = tonumber(ARGV[1])
local rate   = tonumber(ARGV[2])
local now    = tonumber(ARGV[3])
local cost   = tonumber(ARGV[4])

local b      = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(b[1]) or cap
local ts     = tonumber(b[2]) or now

tokens = math.min(cap, tokens + (now - ts) / 1000 * rate)

local allowed = 0
if tokens >= cost then
  tokens  = tokens - cost
  allowed = 1
end

redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', KEYS[1], math.ceil(cap / rate * 1000) + 1000)
return { allowed, math.floor(tokens) }
~~~

Because Redis runs a script atomically, two app instances checking the same key at the same instant cannot both spend the last token.

> !note Pass \`now\` from the app, or use \`redis.call('TIME')\` inside the script. Using Redis time avoids clock skew between app nodes; passing it in keeps the script deterministic for replication. Pick one and be consistent.

## Calling it from Spring

~~~java
@Component
public class RateLimiter {
    private final StringRedisTemplate redis;
    private final RedisScript<List> script =
        RedisScript.of(new ClassPathResource("token_bucket.lua"), List.class);

    public Decision tryAcquire(String clientId, int capacity, double perSec) {
        List<Long> r = redis.execute(script,
            List.of("rl:" + clientId),
            String.valueOf(capacity), String.valueOf(perSec),
            String.valueOf(System.currentTimeMillis()), "1");
        return new Decision(r.get(0) == 1L, r.get(1));
    }
}
~~~

Wire it into a \`OncePerRequestFilter\`, return \`429\` with a \`Retry-After\` header on rejection, and expose \`X-RateLimit-Remaining\` so well-behaved clients can back off before they hit the wall.

## Sliding window log

When the rule really is "at most N in any rolling window", keep a sorted set of request timestamps per client:

~~~lua
-- KEYS[1] = window key; ARGV: limit, window_ms, now_ms, request_id
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[3] - ARGV[2])
local count = redis.call('ZCARD', KEYS[1])
if count < tonumber(ARGV[1]) then
  redis.call('ZADD', KEYS[1], ARGV[3], ARGV[4])
  redis.call('PEXPIRE', KEYS[1], ARGV[2])
  return 1
end
return 0
~~~

It is exact, but memory grows with the limit: a client allowed 10,000 requests per minute costs you up to 10,000 entries. For high limits, the **sliding window counter** — two fixed-window counters weighted by how far you are into the current window — gets you very close for two integers of memory.

## Which one?

| Need | Pick |
|---|---|
| Smooth average, allow bursts | Token bucket |
| Strict "N per rolling window" | Sliding window log |
| Strict-ish, very high limits | Sliding window counter |
| Internal, rough protection only | Fixed window is fine |

## Things that bite in production

- **Key cardinality.** Per-user keys are fine; per-user-per-endpoint-per-IP keys multiply fast. Always set a TTL.
- **Fail open or closed?** If Redis is unreachable, decide deliberately. For abuse protection, failing open with a local in-memory fallback is usually kinder than taking the API down.
- **Hot keys.** One huge tenant on one key lands on one Redis shard. Split by \`tenant:{shard}\` if it shows up in latency.
`
},
{
  slug: "redis-distributed-locks-fencing",
  title: "Distributed locks in Redis: what SET NX PX gets right, and what it can't",
  dek: "A lock with a timeout is a lease, not a lock. The fix for the part that breaks is older than Redis: a fencing token.",
  date: "2026-09-30",
  tags: ["redis", "distributed-systems", "concurrency"],
  body: `
> !tldr \`SET key value NX PX ttl\` plus a compare-and-delete release script is a good **efficiency** lock (stop two workers doing the same job). It is not a **correctness** lock on its own — a paused process can wake up after its lease expired. If correctness matters, have the protected resource reject stale writers using a monotonically increasing fencing token.

## The version that's almost right

~~~bash
SET lock:invoice:42 <random-token> NX PX 30000
~~~

\`NX\` means "only if it does not exist", \`PX\` gives it a 30-second expiry so a crashed holder does not block everyone forever. The random token identifies *who* holds it. Release must check that token, atomically:

~~~lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
~~~

Without the check, worker A — whose lock already expired — could delete the lock that worker B now holds. With plain \`GET\` then \`DEL\` from Java, there's a gap between the two calls. The script closes it.

## The part that breaks

:::fig fencing

Worker A takes the lock and then stops — a long GC pause, a VM migration, a slow network. Its 30 seconds run out. Worker B takes the lock and writes. Then A wakes up, still believing it holds the lock, and writes too. Nothing in Redis can stop this, because A's write does not go through Redis.

Any lock with a timeout has this property. The timeout is what makes it safe against crashes, and also what makes it unsafe against pauses.

## Fencing tokens

Give every successful acquisition a number that only goes up — \`INCR lock:invoice:42:fence\` works. The holder passes that number along with every write, and the **resource** keeps the highest number it has seen and rejects anything lower.

~~~sql
UPDATE invoices
   SET status = 'SETTLED', fence = :token
 WHERE id = :id
   AND fence < :token;      -- stale holder updates 0 rows
~~~

Now A's late write carries token 33, the row already has 34 from B, and the update touches zero rows. The database enforces what the lock could only suggest.

## In Java: Redisson or hand-rolled?

Redisson's \`RLock\` gives you a watchdog that keeps extending the lease while the holder's thread is alive — which shrinks the window but doesn't remove it (a fully paused JVM pauses the watchdog too). It's a solid default for "don't run the nightly job twice".

~~~java
RLock lock = redisson.getLock("lock:report:daily");
if (lock.tryLock(0, TimeUnit.SECONDS)) {   // don't wait; someone else has it
    try {
        reportService.generate();
    } finally {
        if (lock.isHeldByCurrentThread()) lock.unlock();
    }
}
~~~

## Do you need a distributed lock at all?

Often the database already has the tool:

- **Row lock:** \`SELECT ... FOR UPDATE\` serialises work on one row inside a transaction.
- **Optimistic locking:** a \`version\` column with JPA \`@Version\` turns a lost update into a clean retry.
- **Unique constraints:** "only one active job per invoice" is a partial unique index, not a lock.
- **Queue partitioning:** send all events for one key to one Kafka partition and only one consumer ever sees them.

> !note Reach for a Redis lock when the work spans systems and you want to avoid duplicate effort. Reach for fencing or the database when a duplicate would be *wrong*, not just wasteful.
`
},
{
  slug: "cache-aside-without-stampede",
  title: "Cache-aside without the stampede",
  dek: "The cache works great until a hot key expires and five hundred requests hit the database at the same millisecond.",
  date: "2026-08-18",
  tags: ["redis", "caching", "spring-boot", "performance"],
  body: `
> !tldr Cache-aside is simple: read the cache, fall back to the DB, write the cache. The three ways it fails are **stampedes** on expiry, **stale data** after writes, and **penetration** by keys that don't exist. Fix them with request coalescing or early refresh, delete-on-write, and negative caching.

## The pattern

~~~java
public Product get(long id) {
    String key = "product:" + id;
    Product cached = cache.get(key);
    if (cached != null) return cached;

    Product fresh = repo.findById(id).orElseThrow();
    cache.set(key, fresh, Duration.ofMinutes(10));
    return fresh;
}
~~~

That's the whole idea, and for most keys it's all you need. The trouble is concentrated in the few keys that matter most.

## Failure 1: the stampede

A popular key expires. Every request in flight sees a miss at the same moment, and every one of them goes to the database with the same query. The database slows down, requests pile up, timeouts start, retries begin — and you've turned a cache expiry into an incident.

:::fig stampede

### Fix A: coalesce inside one instance

Make concurrent misses for the same key share one load. Caffeine does this for you with \`get(key, loader)\` — only one thread runs the loader; the others wait for its result.

~~~java
LoadingCache<Long, Product> local = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(Duration.ofSeconds(30))
    .build(id -> loadThroughRedis(id));
~~~

A small local cache in front of Redis also takes a lot of read pressure off Redis itself for the hottest keys.

### Fix B: coalesce across instances

With twenty pods, you can still get twenty loads. A short Redis lock (\`SET NX PX 3000\`) on \`rebuild:product:42\` lets one pod rebuild while the rest briefly serve the stale value or wait a few milliseconds and re-read.

### Fix C: refresh before expiry

Store a soft expiry inside the value. When a read finds it's past the soft expiry but before the hard TTL, it serves the current value *and* kicks off a background refresh. Users never see the miss.

### Fix D: jitter

If you warm ten thousand keys at deploy time with the same TTL, they'll all expire together. Add randomness: \`ttl = base + random(0, base * 0.1)\`.

## Failure 2: stale data after a write

On update, **delete** the key rather than writing the new value into it:

~~~java
@Transactional
public void rename(long id, String name) {
    repo.updateName(id, name);
    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
        @Override public void afterCommit() { cache.delete("product:" + id); }
    });
}
~~~

Two details in there matter. Deleting avoids a race where two writers set the cache in the opposite order to their DB commits. And doing it **after commit** avoids a reader repopulating the cache with the old row before your transaction lands.

> !note If you need stronger guarantees, drive invalidation from the database change stream (CDC → Kafka → cache delete) so no code path can forget to do it.

## Failure 3: penetration

Requests for IDs that don't exist always miss the cache and always hit the database — whether from a bug or from someone scanning your API. Cache the absence too: store a small sentinel like \`"∅"\` for a short TTL (30–60 seconds). For very large key spaces, a Bloom filter in front tells you "definitely not present" without touching the DB.

## Spring's \`@Cacheable\`

\`@Cacheable(sync = true)\` gives you per-instance coalescing for free and is a great default for read-mostly data. It won't give you soft expiry, after-commit eviction, or negative caching with a separate TTL, so for the handful of hot, frequently-written keys, an explicit cache service like the one above is easier to reason about.

## What to measure

- **Hit ratio per key prefix**, not overall — a 95% total can hide a 20% on the one prefix that matters.
- **DB QPS on cache-backed queries** around TTL boundaries. Sawtooth spikes are stampedes.
- **Cache payload size.** Serialising a 400 KB object on every hit is a latency problem of its own.
`
},
{
  slug: "kafka-retries-dlq-ordering",
  title: "Kafka consumers that survive bad messages: retry topics, DLQs and ordering",
  dek: "One poison message shouldn't stop a partition, and a retry strategy shouldn't quietly reorder a customer's events.",
  date: "2026-07-27",
  tags: ["kafka", "spring-boot", "distributed-systems"],
  body: `
> !tldr Separate **transient** failures (retry with backoff) from **permanent** ones (send straight to a DLQ). Use non-blocking retry topics for throughput, but know they break per-key ordering — if ordering matters, retry in place or park the whole key.

## The default is a trap

A consumer throws on a message. The default behaviour in many setups is to seek back and try again — forever. One malformed record blocks its partition, lag climbs, and every other message on that partition waits behind it. That's a full outage for a slice of your customers caused by one bad payload.

## Classify the failure first

| Failure | Example | What to do |
|---|---|---|
| Transient | DB timeout, downstream 503 | Retry with backoff |
| Permanent | Bad schema, missing required field | DLQ immediately |
| Business | Account closed, limit exceeded | Handle as a normal outcome, not an error |

Retrying a deserialization error five times with exponential backoff just delays the DLQ by a minute and adds noise to your dashboards.

## Non-blocking retries in Spring Kafka

~~~java
@RetryableTopic(
    attempts = "4",
    backoff = @Backoff(delay = 1000, multiplier = 4.0),
    exclude = { DeserializationException.class, ValidationException.class },
    dltTopicSuffix = ".dlt")
@KafkaListener(topics = "loan-events", groupId = "ledger")
public void handle(LoanEvent e) {
    ledger.apply(e);
}

@DltHandler
public void dead(LoanEvent e, @Header(KafkaHeaders.EXCEPTION_MESSAGE) String reason) {
    alerts.parked("loan-events", e.id(), reason);
}
~~~

A failing record moves to \`loan-events-retry-0\`, then \`-retry-1\` and so on, each consumed after its delay. The main topic keeps flowing. Excluded exceptions skip straight to the DLT.

## The ordering cost

Here's the catch. Suppose \`LoanCreated\` for loan 42 fails transiently and moves to a retry topic, then \`LoanRepaid\` for loan 42 arrives and succeeds. You've now applied a repayment to a loan that, as far as the ledger knows, doesn't exist yet.

Non-blocking retries trade **per-key ordering** for **throughput**. That's often fine — independent notifications, analytics events. For state machines it isn't.

Options when order matters:

- **Blocking retry** (\`DefaultErrorHandler\` with a \`FixedBackOff\`) for a small number of quick attempts. The partition pauses, but order is preserved.
- **Park the key.** When a message for key K fails, record K as parked and route every later message for K to the parking topic too, until the head is resolved. More moving parts, but other keys keep flowing.
- **Make consumers tolerant.** Version your events and let the consumer detect "I'm seeing v3 before v2" and defer. This is the most robust and the most work.

## A DLQ is a queue, not a bin

Messages in a DLQ are customer actions that didn't happen. Treat it like an inbox:

- Alert on DLQ growth, not just presence.
- Keep the original headers, the exception, and the source partition/offset with each record.
- Build a replay path — a small admin endpoint or job that republishes selected records to the main topic after a fix. Because your consumers are idempotent (they are, right?), replaying is safe.

## Commit semantics, briefly

With \`enable.auto.commit=false\` and Spring's default \`AckMode.BATCH\`, offsets are committed after the listener returns. Crash in the middle and you'll reprocess — which is exactly why the consumer has to dedupe on event ID. "At-least-once plus idempotent handler" is the boring, reliable combination; reach for Kafka transactions only when you're consuming and producing to Kafka in the same step.
`
}
];
