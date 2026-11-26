/* ==========================================================
   Waquar Imdad — site runtime. No frameworks, no build step.
   ========================================================== */

/* ---- Edit these to make the site yours ---- */
const CONFIG = {
  name: "Waquar Imdad",
  email: "info.wimdad@gmail.com",
  linkedin: "https://www.linkedin.com/in/waquar-imdad-619b9b62/",   // empty hides the links
  github: "https://github.com/Waquarimdad",
  cv: "Waquar-Imdad-CV.pdf",            // drop the PDF next to index.html
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const POSTS = (window.POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
POSTS.forEach((p) => {
  p.words = p.body.split(/\s+/).length;
  p.mins = Math.max(1, Math.round(p.words / 220));
});
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M6 11l6 6 6-6M5 20h14"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4z"/></svg>',
  gh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8M5 10v10h14V10"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
};

/* ==========================================================
   Content
   ========================================================== */
const WORK = [
  {
    co: "Infosys · BNSF Railway", when: "May 2024 – Jul 2026", role: "Senior Associate Consultant",
    title: "Operations platform for a Class I railroad",
    summary: "Backend services for BNSF's railway platform — Java and Spring Boot microservices in an event-driven architecture, running on AWS.",
    points: ["Spring Boot services integrated over Kafka", "Redis for caching, distributed locking and rate limiting", "Containerised on Docker / Kubernetes (EKS), observed through CloudWatch"],
    stack: ["Java", "Spring Boot", "Kafka", "Redis", "PostgreSQL", "AWS EKS"],
  },
  {
    co: "ePayLater · BNPL lending", when: "Apr 2022 – Nov 2023", role: "Senior Software Development Engineer",
    title: "Buy-now-pay-later lending backend",
    summary: "Services behind a B2B buy-now-pay-later product, where every API that touches money has to be safe to retry.",
    points: ["Payment and repayment flows designed around idempotency", "Event-driven integration between lending services", "Data in PostgreSQL and MongoDB, cached in Redis"],
    stack: ["Java", "Spring Boot", "Kafka", "Redis", "MongoDB", "AWS"],
  },
  {
    co: "Drucare · Healthcare", when: "Jul 2020 – Apr 2022", role: "Java Developer",
    title: "Healthcare platform services",
    summary: "Where I started: Java and Spring Boot services for a healthcare product, plus front-end work in Angular and React.",
    points: ["REST APIs on Spring Boot", "Relational data modelling in PostgreSQL", "Full-stack features with Angular and React"],
    stack: ["Java", "Spring Boot", "PostgreSQL", "Angular", "React"],
  },
];

const PRINCIPLES = [
  ["Assume the retry", "Every call can happen twice — clients, load balancers and Kafka all retry. I design so the second call is boring."],
  ["Make failure a state", "Timeouts, partial success and “unknown” are modelled explicitly, reconciled later, and never guessed at."],
  ["Measure, then tune", "Dashboards and profiles before opinions. Fix the bottleneck you can see, then look again."],
];

const SKILLS = [
  ["Languages & frameworks", ["Java", "Spring Boot", "Spring Data JPA", "Spring AI", "REST", "Microservices"]],
  ["Messaging & caching", ["Apache Kafka", "Redis", "Cache-aside", "Distributed locks", "Rate limiting"]],
  ["Data", ["PostgreSQL", "MongoDB", "SQL tuning", "Schema design"]],
  ["Cloud & DevOps", ["AWS EC2", "S3", "EKS", "RDS", "CloudWatch", "Docker", "Kubernetes"]],
  ["Design", ["Event-driven systems", "Idempotent APIs", "Resilience patterns"]],
  ["Front-end", ["Angular", "React", "TypeScript"]],
];

/* ==========================================================
   Markdown + syntax highlighting
   ========================================================== */
function inline(s) {
  const keep = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { keep.push("<code>" + esc(c) + "</code>"); return "\u0000" + (keep.length - 1) + "\u0000"; });
  s = esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[+i]);
}

const KW = {
  java: "public private protected class interface record enum static final void return new if else for while try catch finally throw throws import package extends implements this super null true false int long double boolean var",
  sql: "create table primary key not null default insert into values on conflict do nothing select from where update set and for interval now text int jsonb timestamptz",
  lua: "local if then else end return and or not function nil true false",
  bash: "set nx px get del",
};
const LANG_COMMENT = { java: "//[^\\n]*|/\\*[\\s\\S]*?\\*/", sql: "--[^\\n]*", lua: "--[^\\n]*", bash: "#[^\\n]*" };

function highlight(code, lang) {
  const kw = new Set((KW[lang] || "").split(" "));
  const comment = LANG_COMMENT[lang] || "//[^\\n]*";
  const str = '"""[\\s\\S]*?"""|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'';
  const re = new RegExp("(" + comment + ")|(" + str + ")|(@\\w+)|(\\b\\d[\\d_]*(?:\\.\\d+)?\\b)|(\\b[A-Za-z_]\\w*\\b)", "g");
  let out = "", last = 0, m;
  const ci = lang === "sql" || lang === "bash";
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const t = esc(m[0]);
    if (m[1]) out += '<span class="tk-c">' + t + "</span>";
    else if (m[2]) out += '<span class="tk-s">' + t + "</span>";
    else if (m[3]) out += '<span class="tk-a">' + t + "</span>";
    else if (m[4]) out += '<span class="tk-n">' + t + "</span>";
    else {
      const w = ci ? m[0].toLowerCase() : m[0];
      if (kw.has(w)) out += '<span class="tk-k">' + t + "</span>";
      else if (lang === "java" && /^[A-Z]/.test(m[0])) out += '<span class="tk-t">' + t + "</span>";
      else out += t;
    }
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}

function md(src) {
  const lines = src.replace(/^\n+|\n+$/g, "").split("\n");
  const out = [], toc = [];
  let i = 0;
  const isBlock = (l) => /^(#{2,3} |~~~|> |- |\d+\. |\||:::)/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (l.startsWith("~~~")) {
      const lang = l.slice(3).trim() || "text";
      const buf = []; i++;
      while (i < lines.length && !lines[i].startsWith("~~~")) buf.push(lines[i++]);
      i++;
      out.push(`<div class="code"><div class="code-head"><span>${esc(lang)}</span><button type="button" data-copy>Copy</button></div><pre><code>${highlight(buf.join("\n"), lang)}</code></pre></div>`);
      continue;
    }
    if (l.startsWith(":::")) {
      const [kind, name] = l.slice(3).trim().split(/\s+/);
      out.push(kind === "demo" ? `<div data-demo="${name}"></div>` : `<figure class="fig" data-fig="${name}"></figure>`);
      i++; continue;
    }
    let h = l.match(/^(#{2,3}) (.*)/);
    if (h) {
      const text = inline(h[2]), id = slugify(h[2]);
      if (h[1] === "##") { toc.push({ id, text: h[2].replace(/`/g, "") }); out.push(`<h2 id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${text}</h2>`); }
      else out.push(`<h3 id="${id}">${text}</h3>`);
      i++; continue;
    }
    if (l.startsWith("> ")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^> ?/, ""));
      let cls = "", lbl = "";
      const mm = buf[0].match(/^!(tldr|note|warn)\s*/);
      if (mm) { cls = mm[1]; lbl = { tldr: "TL;DR", note: "Note", warn: "Watch out" }[mm[1]]; buf[0] = buf[0].slice(mm[0].length); }
      const paras = buf.join("\n").split(/\n\s*\n/).map((p) => "<p>" + inline(p.replace(/\n/g, " ")) + "</p>").join("");
      out.push(`<blockquote class="${cls}">${lbl ? `<span class="lbl">${lbl}</span>` : ""}${paras}</blockquote>`);
      continue;
    }
    if (l.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]), body = rows.slice(2).map(cells);
      out.push(`<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^(- |\d+\. )/.test(l)) {
      const ordered = /^\d+\. /.test(l), buf = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) buf.push(lines[i++].replace(/^(- |\d+\. )/, ""));
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${buf.map((b) => `<li>${inline(b)}</li>`).join("")}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isBlock(lines[i])) buf.push(lines[i++]);
    out.push("<p>" + inline(buf.join(" ")) + "</p>");
  }
  return { html: out.join("\n"), toc };
}

/* ==========================================================
   Diagrams (inline SVG, themed by CSS variables)
   ========================================================== */
const FIGS = {
  shutdown: {
    cap: "Top: without preStop, the app closes its port while load balancers still route to it. Bottom: a short sleep lets routing catch up before shutdown starts.",
    svg: () => {
      const X0 = 150, S = 40; // 40px per second, t=0 at X0
      const x = (t) => X0 + t * S;
      const bar = (t1, t2, y, cls, label) => `<rect class="${cls}" x="${x(t1)}" y="${y}" width="${x(t2) - x(t1)}" height="26" rx="6"/><text class="d-s" x="${(x(t1) + x(t2)) / 2}" y="${y + 17}" text-anchor="middle" style="fill:var(--ink)">${label}</text>`;
      const lane = (y, t) => `<text class="d-t" x="14" y="${y + 17}">${t}</text>`;
      const axis = (y) => { let s = `<line class="d-line" x1="${x(0)}" y1="${y}" x2="${x(12)}" y2="${y}"/>`; for (let t = 0; t <= 12; t += 2) s += `<line class="d-line" x1="${x(t)}" y1="${y - 3}" x2="${x(t)}" y2="${y + 3}"/><text class="d-s" x="${x(t)}" y="${y + 16}" text-anchor="middle">${t}s</text>`; return s; };
      return `<svg viewBox="0 0 660 304" role="img" aria-label="Pod termination timeline with and without a preStop sleep">
        <text class="d-s" x="14" y="20" style="fill:var(--accent)">WITHOUT preStop</text>
        ${lane(30, "Load balancer")}${bar(0, 5, 30, "d-box", "still routing to pod")}
        ${lane(64, "Spring Boot")}${bar(0, 0.4, 64, "d-hot", "")}${bar(0.4, 5, 64, "d-hot", "port closed → 502s")}${bar(5, 9, 64, "d-box", "draining")}
        ${axis(108)}
        <text class="d-s" x="14" y="160" style="fill:var(--ok)">WITH preStop sleep 10s</text>
        ${lane(170, "Load balancer")}${bar(0, 5, 170, "d-box", "routing")}${bar(5, 12, 170, "d-good", "removed ✓")}
        ${lane(204, "kubelet")}${bar(0, 10, 204, "d-good", "preStop: sleep 10")}<text class="d-s" x="${x(10) + 6}" y="221" style="fill:var(--accent)">SIGTERM</text>
        ${lane(238, "Spring Boot")}${bar(0, 10, 238, "d-box", "serving normally")}${bar(10, 12, 238, "d-good", "drain")}
        <line class="d-line d-acc d-dash" x1="${x(10)}" y1="164" x2="${x(10)}" y2="270"/>
        ${axis(284)}
      </svg>`;
    },
  },
  outbox: {
    cap: "The request path writes only to Postgres. The relay publishes outbox rows to Kafka and marks them published after the broker acks.",
    svg: () => {
      const box = (x, y, w, h, t, s, cls = "d-box") => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text class="d-t" x="${x + w / 2}" y="${y + h / 2 - (s ? 3 : -4)}" text-anchor="middle">${t}</text>${s ? `<text class="d-s" x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle">${s}</text>` : ""}`;
      const arr = (x1, y1, x2, y2, cls = "") => `<line class="d-line ${cls}" x1="${x1}" y1="${y1}" x2="${x2 - 6}" y2="${y2}"/><path class="d-line ${cls}" d="M${x2 - 12} ${y2 - 5} L${x2} ${y2} L${x2 - 12} ${y2 + 5}"/>`;
      return `<svg viewBox="0 0 660 260" role="img" aria-label="Transactional outbox: service writes order and outbox row in one transaction; relay publishes to Kafka">
        ${box(14, 100, 120, 60, "Order API", "Spring Boot")}
        <rect class="d-good" x="176" y="30" width="200" height="200" rx="14" stroke-dasharray="5 4" fill-opacity=".35"/>
        <text class="d-s" x="276" y="52" text-anchor="middle" style="fill:var(--ok)">ONE TRANSACTION</text>
        ${box(196, 66, 160, 56, "orders", "INSERT row")}
        ${box(196, 140, 160, 56, "outbox", "INSERT event")}
        ${arr(134, 116, 196, 94, "d-okl")}${arr(134, 144, 196, 168, "d-okl")}
        ${box(418, 140, 100, 56, "Relay", "SKIP LOCKED")}
        ${arr(356, 168, 418, 168)}
        ${box(556, 100, 92, 60, "Kafka", "orders.events")}
        ${arr(518, 158, 556, 140)}
        <path class="d-line d-dash" d="M468 196 C 468 236, 300 240, 290 198"/><text class="d-s" x="380" y="248" text-anchor="middle">mark published after ack</text>
        <text class="d-s" x="602" y="186" text-anchor="middle">consumers</text><text class="d-s" x="602" y="200" text-anchor="middle">dedupe on event-id</text>
      </svg>`;
    },
  },
  idempotency: {
    cap: "First attempt times out after the work commits. The retry carries the same key and gets the stored response.",
    svg: () => {
      const col = (x, t, s) => `<rect class="d-box" x="${x - 62}" y="14" width="124" height="40" rx="10"/><text class="d-t" x="${x}" y="38" text-anchor="middle">${t}</text><text class="d-s" x="${x}" y="72" text-anchor="middle">${s}</text><line class="d-line d-dash" x1="${x}" y1="82" x2="${x}" y2="372"/>`;
      const arr = (x1, x2, y, t, cls = "") => {
        const dir = x2 > x1 ? -1 : 1;
        return `<line class="d-line ${cls}" x1="${x1}" y1="${y}" x2="${x2 + dir * 4}" y2="${y}"/><path class="d-line ${cls}" d="M${x2 + dir * 10} ${y - 5} L${x2} ${y} L${x2 + dir * 10} ${y + 5}"/><text class="d-s" x="${(x1 + x2) / 2}" y="${y - 8}" text-anchor="middle">${t}</text>`;
      };
      return `<svg viewBox="0 0 640 390" role="img" aria-label="Idempotent retry sequence">
        ${col(90, "Client", "mobile / partner")}${col(320, "Payments API", "Spring Boot")}${col(550, "Postgres", "keys + ledger")}
        ${arr(90, 320, 112, "POST /charge  key=7f3a")}
        ${arr(320, 550, 142, "INSERT key … ON CONFLICT")}
        ${arr(320, 550, 172, "debit + store response  (1 txn)", "d-okl")}
        <rect class="d-good" x="474" y="186" width="152" height="24" rx="6"/><text class="d-t" x="550" y="202" text-anchor="middle">COMMIT ✓</text>
        <line class="d-line d-acc d-dash" x1="320" y1="232" x2="160" y2="232"/><text class="d-s" x="240" y="224" text-anchor="middle" style="fill:var(--accent)">response lost — timeout</text>
        <text class="d-t" x="90" y="236" text-anchor="middle" style="fill:var(--accent)">✕</text>
        ${arr(90, 320, 280, "retry  key=7f3a  (same body)")}
        ${arr(320, 550, 308, "conflict → SELECT stored response")}
        ${arr(320, 90, 346, "201 replayed · no 2nd debit", "d-okl")}
      </svg>`;
    },
  },
  fencing: {
    cap: "A's lease expires during a pause. Its late write carries fence 33; the row already holds 34, so the update is rejected.",
    svg: () => `<svg viewBox="0 0 640 260" role="img" aria-label="Fencing token timeline">
      <text class="d-s" x="20" y="22">time →</text>
      <line class="d-line" x1="90" y1="70" x2="620" y2="70"/><line class="d-line" x1="90" y1="150" x2="620" y2="150"/><line class="d-line" x1="90" y1="225" x2="620" y2="225"/>
      <text class="d-t" x="20" y="74">Worker A</text><text class="d-t" x="20" y="154">Worker B</text><text class="d-t" x="20" y="229">Database</text>
      <rect class="d-box" x="100" y="56" width="110" height="28" rx="7"/><text class="d-t" x="155" y="74" text-anchor="middle">lock · fence 33</text>
      <rect class="d-hot" x="220" y="56" width="200" height="28" rx="7" stroke-dasharray="4 3"/><text class="d-t" x="320" y="74" text-anchor="middle">GC pause … lease expires</text>
      <rect class="d-box" x="300" y="136" width="110" height="28" rx="7"/><text class="d-t" x="355" y="154" text-anchor="middle">lock · fence 34</text>
      <rect class="d-good" x="420" y="136" width="80" height="28" rx="7"/><text class="d-t" x="460" y="154" text-anchor="middle">write 34</text>
      <path class="d-line d-okl" d="M460 164 L460 211"/><path class="d-line d-okl" d="M455 204 L460 212 L465 204"/>
      <rect class="d-good" x="410" y="212" width="100" height="26" rx="7"/><text class="d-t" x="460" y="229" text-anchor="middle">fence=34 ✓</text>
      <rect class="d-hot" x="510" y="56" width="90" height="28" rx="7"/><text class="d-t" x="555" y="74" text-anchor="middle">write 33</text>
      <path class="d-line d-acc" d="M555 84 L555 211"/><path class="d-line d-acc" d="M550 204 L555 212 L560 204"/>
      <rect class="d-hot" x="516" y="212" width="104" height="26" rx="7"/><text class="d-t" x="568" y="229" text-anchor="middle" style="fill:var(--accent)">0 rows ✕</text>
    </svg>`,
  },
  stampede: {
    cap: "Left: every miss goes to the database at once. Right: concurrent misses share one load.",
    svg: () => {
      let reqL = "", reqR = "";
      for (let k = 0; k < 7; k++) {
        const y = 40 + k * 26;
        reqL += `<circle cx="34" cy="${y}" r="5" fill="var(--ink-3)"/><path class="d-line d-acc" d="M42 ${y} C 90 ${y}, 110 130, 150 130" opacity=".6"/><path class="d-line d-acc" d="M196 130 C 230 130, 240 ${y}, 270 ${y * 0 + 130}" opacity="0"/>`;
        reqR += `<circle cx="364" cy="${y}" r="5" fill="var(--ink-3)"/><path class="d-line" d="M372 ${y} C 420 ${y}, 440 130, 480 130" opacity=".6"/>`;
      }
      return `<svg viewBox="0 0 640 250" role="img" aria-label="Cache stampede versus coalesced load">
        <text class="d-s" x="20" y="18">WITHOUT COALESCING</text><text class="d-s" x="350" y="18">WITH COALESCING</text>
        ${reqL}
        <rect class="d-hot" x="150" y="112" width="70" height="36" rx="8"/><text class="d-t" x="185" y="134" text-anchor="middle">miss ×7</text>
        <path class="d-line d-acc" d="M220 124 L262 116 M220 130 L262 130 M220 136 L262 144" />
        <rect class="d-hot" x="262" y="100" width="62" height="60" rx="8"/><text class="d-t" x="293" y="128" text-anchor="middle">DB</text><text class="d-s" x="293" y="144" text-anchor="middle" style="fill:var(--accent)">7 q</text>
        ${reqR}
        <rect class="d-box" x="480" y="112" width="70" height="36" rx="8"/><text class="d-t" x="515" y="134" text-anchor="middle">1 load</text>
        <path class="d-line d-okl" d="M550 130 L572 130"/>
        <rect class="d-good" x="572" y="100" width="56" height="60" rx="8"/><text class="d-t" x="600" y="128" text-anchor="middle">DB</text><text class="d-s" x="600" y="144" text-anchor="middle" style="fill:var(--ok)">1 q</text>
        <text class="d-s" x="185" y="232" text-anchor="middle">latency ↑ · timeouts · retries</text>
        <text class="d-s" x="515" y="232" text-anchor="middle">others wait on the same future</text>
      </svg>`;
    },
  },
};

function mountFigs(root) {
  $$("[data-fig]", root).forEach((f) => {
    const d = FIGS[f.dataset.fig];
    if (!d) return;
    f.innerHTML = d.svg() + `<figcaption>${esc(d.cap)}</figcaption>`;
  });
}

/* ==========================================================
   Interactive: token bucket simulator
   ========================================================== */
function mountDemos(root) {
  $$('[data-demo="token-bucket"]', root).forEach(tokenBucket);
  $$('[data-demo="outbox"]', root).forEach(outboxDemo);
}

/* Interactive: dual write vs transactional outbox, with crashes */
function outboxDemo(el) {
  el.className = "demo";
  el.innerHTML = `
    <div class="demo-head"><b><span class="badge-demo">Live</span> Dual write vs outbox</b>
      <div class="demo-btns">
        <button type="button" data-m="dual" class="hot">Dual write</button><button type="button" data-m="outbox">Outbox</button>
      </div></div>
    <div class="demo-body">
      <div class="demo-ctrl">
        <label><span>Crash after commit <output data-o="crash"></output></span><input type="range" min="0" max="100" step="10" value="30" data-i="crash"></label>
        <div class="demo-btns" style="flex-direction:column;align-items:stretch">
          <button type="button" data-a="one">Place 1 order</button>
          <button type="button" data-a="ten">Place 10 orders</button>
          <button type="button" data-a="relay">Run relay</button>
          <button type="button" data-a="reset">Reset</button>
        </div>
      </div>
      <div class="demo-stage">
        <div class="ob-cols">
          <div class="ob-col"><span>Postgres · orders</span><div class="ob-dots" data-c="db"></div></div>
          <div class="ob-col" data-outbox-col><span>Postgres · outbox (unpublished)</span><div class="ob-dots" data-c="ob"></div></div>
          <div class="ob-col"><span>Kafka · orders.events</span><div class="ob-dots" data-c="kf"></div></div>
        </div>
        <div class="demo-stats"><div><span>Orders saved</span><b data-s="db">0</b></div><div><span>Events in Kafka</span><b data-s="kf">0</b></div><div><span>Lost events</span><b data-s="lost">0</b></div></div>
        <p class="demo-note" data-note></p>
      </div>
    </div>`;
  const S = { mode: "dual", db: [], ob: [], kf: [], n: 0 };
  const crash = $('[data-i="crash"]', el);
  const sync = () => ($('[data-o="crash"]', el).textContent = crash.value + "%");
  crash.addEventListener("input", sync); sync();
  const dot = (id, cls) => `<i class="${cls}" title="order #${id}">${id}</i>`;
  function render() {
    const inKafka = new Set(S.kf), pending = new Set(S.ob);
    $('[data-c="db"]', el).innerHTML = S.db.map((id) => dot(id, inKafka.has(id) ? "ok" : pending.has(id) ? "wait" : "lost")).join("");
    $('[data-c="ob"]', el).innerHTML = S.ob.map((id) => dot(id, "wait")).join("");
    $('[data-c="kf"]', el).innerHTML = S.kf.map((id) => dot(id, "ok")).join("");
    const lost = S.db.filter((id) => !inKafka.has(id) && !pending.has(id)).length;
    $('[data-s="db"]', el).textContent = S.db.length;
    $('[data-s="kf"]', el).textContent = S.kf.length;
    const l = $('[data-s="lost"]', el); l.textContent = lost; l.style.color = lost ? "var(--accent)" : "";
    $("[data-outbox-col]", el).style.opacity = S.mode === "outbox" ? 1 : 0.35;
    $('[data-a="relay"]', el).disabled = S.mode !== "outbox";
    $("[data-note]", el).textContent = S.mode === "dual"
      ? (lost ? `${lost} order(s) were saved, but the pod died before publishing. No consumer will ever hear about them.` : "Each order is saved, then published in a second step. Crashes land in the gap between the two.")
      : (S.ob.length ? `${S.ob.length} event(s) waiting in the outbox. They're safe in Postgres. Run the relay and they reach Kafka.` : "The order and its event commit together. The relay publishes later, so a crash just delays an event.");
  }
  function place() {
    const id = ++S.n, crashed = Math.random() * 100 < +crash.value;
    S.db.push(id);
    if (S.mode === "dual") { if (!crashed) S.kf.push(id); }
    else { S.ob.push(id); }
  }
  function relay() { while (S.ob.length) S.kf.push(S.ob.shift()); }
  $$("[data-m]", el).forEach((b) => b.addEventListener("click", () => {
    S.mode = b.dataset.m; S.db = []; S.ob = []; S.kf = []; S.n = 0;
    $$("[data-m]", el).forEach((x) => x.classList.toggle("hot", x === b)); render();
  }));
  $$("[data-a]", el).forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.a;
    if (a === "one") place();
    if (a === "ten") for (let k = 0; k < 10; k++) place();
    if (a === "relay") relay();
    if (a === "reset") { S.db = []; S.ob = []; S.kf = []; S.n = 0; }
    render();
  }));
  render();
}

function tokenBucket(el) {
  el.className = "demo";
  el.innerHTML = `
    <div class="demo-head"><b><span class="badge-demo">Live</span> Token bucket simulator</b>
      <div class="demo-btns"><button type="button" data-a="burst">Burst ×15</button><button type="button" data-a="pause">Pause traffic</button><button type="button" data-a="reset">Reset</button></div></div>
    <div class="demo-body">
      <div class="demo-ctrl">
        <label><span>Capacity <output data-o="cap"></output></span><input type="range" min="1" max="20" value="10" data-i="cap"></label>
        <label><span>Refill / sec <output data-o="rate"></output></span><input type="range" min="1" max="10" value="3" data-i="rate"></label>
        <label><span>Traffic / sec <output data-o="rps"></output></span><input type="range" min="0" max="20" value="5" data-i="rps"></label>
      </div>
      <div class="demo-stage">
        <div class="bucket"><div class="tank" aria-hidden="true"><div class="fill"></div><div class="lvl">10</div></div><div class="reqs" aria-hidden="true"></div></div>
        <div class="demo-stats"><div><span>Allowed</span><b data-s="ok">0</b></div><div><span>Rejected · 429</span><b data-s="no">0</b></div><div><span>Accept rate</span><b data-s="pct">—</b></div></div>
        <p class="demo-note">Green bars are requests that got a token; orange bars were rejected. Traffic above the refill rate drains the bucket — bursts are only absorbed while tokens remain.</p>
      </div>
    </div>`;
  const inp = (n) => $(`[data-i="${n}"]`, el);
  const S = { tokens: 10, acc: 0, ok: 0, no: 0, paused: false, bars: [] };
  const fill = $(".fill", el), lvl = $(".lvl", el), lane = $(".reqs", el);
  const sync = () => ["cap", "rate", "rps"].forEach((n) => ($(`[data-o="${n}"]`, el).textContent = inp(n).value));
  sync();
  $$("input", el).forEach((i) => i.addEventListener("input", () => { sync(); S.tokens = Math.min(S.tokens, +inp("cap").value); }));
  const request = () => {
    const ok = S.tokens >= 1;
    if (ok) { S.tokens -= 1; S.ok++; } else S.no++;
    const b = document.createElement("i");
    b.className = ok ? "ok" : "no";
    b.style.height = (ok ? 40 + Math.random() * 60 : 20 + Math.random() * 30) + "%";
    lane.appendChild(b);
    S.bars.push({ el: b, x: lane.clientWidth });
    if (S.bars.length > 140) S.bars.shift().el.remove();
  };
  $$("[data-a]", el).forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.a;
    if (a === "burst") for (let k = 0; k < 15; k++) setTimeout(request, k * 25);
    if (a === "pause") { S.paused = !S.paused; b.textContent = S.paused ? "Resume traffic" : "Pause traffic"; b.classList.toggle("hot", S.paused); }
    if (a === "reset") { S.tokens = +inp("cap").value; S.ok = S.no = 0; S.bars.forEach((x) => x.el.remove()); S.bars = []; }
  }));
  let last = performance.now(), visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);
  function frame(now) {
    if (!el.isConnected) return;
    const dt = Math.max(0, Math.min(1, (now - last) / 1000)); last = now;
    if (visible) {
      const cap = +inp("cap").value, rate = +inp("rate").value, rps = +inp("rps").value;
      S.tokens = Math.min(cap, S.tokens + rate * dt);
      if (!S.paused) { S.acc += rps * dt * (0.6 + Math.random() * 0.8); while (S.acc >= 1) { S.acc -= 1; request(); } }
      const speed = 70 * dt;
      S.bars.forEach((b) => { b.x -= speed; b.el.style.transform = `translateX(${b.x}px)`; });
      while (S.bars.length && S.bars[0].x < -10) S.bars.shift().el.remove();
      fill.style.height = (S.tokens / cap) * 100 + "%";
      lvl.textContent = Math.floor(S.tokens);
      $('[data-s="ok"]', el).textContent = S.ok;
      $('[data-s="no"]', el).textContent = S.no;
      $('[data-s="pct"]', el).textContent = S.ok + S.no ? Math.round((S.ok / (S.ok + S.no)) * 100) + "%" : "—";
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ==========================================================
   Hero: live Kafka topic visualisation with consumer rebalance
   ========================================================== */
function mountHeroViz(host) {
  if (!host) return;
  const W = 560, H = 330, P = [70, 165, 260];
  const prodY = [48, 143, 238], consY = [48, 143, 238];
  const colors = ["var(--accent)", "var(--ink)", "var(--ok)", "var(--ink-3)"];
  let assign = [0, 1, 2];               // partition -> consumer
  const down = new Set();
  host.innerHTML = `
    <div class="viz-head"><div class="dots"><i></i><i></i><i></i></div><span>orders.events · 3 partitions · group=ledger</span>
      <div class="viz-btns"><button type="button" data-v="pause" aria-pressed="false" aria-label="Pause or play animation">❚❚ pause</button><button type="button" data-v="burst">burst</button><button type="button" data-v="kill">kill c2</button></div></div>
    <svg viewBox="0 0 ${W} ${H}" aria-label="Animated diagram: producers publish keyed events to three Kafka partitions consumed by a consumer group" role="img">
      <g id="wires"></g>
      ${prodY.map((y, i) => `<g><rect class="n-box" x="16" y="${y}" width="98" height="44" rx="10"/><text class="n-label" x="65" y="${y + 21}" text-anchor="middle">producer-${i + 1}</text><text class="n-sub" x="65" y="${y + 34}" text-anchor="middle">${["CHECKOUT", "REPAY", "REFUND"][i]}</text></g>`).join("")}
      <rect x="186" y="34" width="190" height="272" rx="14" fill="none" stroke="var(--line-2)" stroke-dasharray="2 4"/>
      <text class="n-sub" x="281" y="26" text-anchor="middle">TOPIC</text>
      ${P.map((y, i) => `<rect class="lane" x="198" y="${y - 18}" width="166" height="36" rx="8"/><text class="n-sub" x="206" y="${y - 22}">P${i}</text><text class="n-sub" id="off${i}" x="356" y="${y - 22}" text-anchor="end">offset 0</text>`).join("")}
      ${consY.map((y, i) => `<g id="c${i}"><rect class="n-box" x="446" y="${y}" width="98" height="44" rx="10"/><text class="n-label" x="495" y="${y + 21}" text-anchor="middle">consumer-${i + 1}</text><text class="n-sub" id="cs${i}" x="495" y="${y + 34}" text-anchor="middle">P${i}</text></g>`).join("")}
      <g id="pk"></g>
    </svg>
    <div class="viz-foot"><div><span>Produced</span><b id="vp">0</b></div><div><span>Consumed</span><b id="vc">0</b></div><div><span>Lag</span><b id="vl">0</b></div></div>`;
  const svg = $("svg", host), pkG = $("#pk", svg), wires = $("#wires", svg);
  const pk = [];
  const offsets = [0, 0, 0];
  let produced = 0, consumed = 0;

  function drawWires() {
    let w = "";
    prodY.forEach((y) => P.forEach((py) => (w += `<path class="wire" d="M114 ${y + 22} C 150 ${y + 22}, 160 ${py}, 198 ${py}" opacity=".5"/>`)));
    P.forEach((py, p) => { const cy = consY[assign[p]] + 22; w += `<path class="wire" d="M364 ${py} C 400 ${py}, 410 ${cy}, 446 ${cy}" style="stroke:var(--ink-2)"/>`; });
    wires.innerHTML = w;
    consY.forEach((_, c) => {
      const parts = P.map((_, p) => p).filter((p) => assign[p] === c);
      $("#cs" + c, svg).textContent = down.has(c) ? "DOWN" : parts.length ? parts.map((p) => "P" + p).join(" · ") : "idle";
      $("#c" + c, svg).classList.toggle("node-down", down.has(c));
    });
  }
  drawWires();

  function spawn() {
    const prod = Math.floor(Math.random() * 3), key = Math.floor(Math.random() * 4), part = (key * 7 + prod) % 3;
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", "5"); c.setAttribute("fill", colors[key]);
    pkG.appendChild(c);
    pk.push({ el: c, prod, part, t: 0, stage: 0, x: 114, y: prodY[prod] + 22, slot: 0 });
    produced++;
  }
  const bez = (a, b, c, d, t) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;

  // Runs everywhere. With "Reduce motion" on, it runs calmer instead of freezing; the pause button stops it for anyone.
  const pace = reduceMotion ? 0.6 : 1;
  let last = performance.now(), acc = 0, visible = true, paused = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(host);
  $$("[data-v]", host).forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.v === "pause") { paused = !paused; b.textContent = paused ? "▶ play" : "❚❚ pause"; b.setAttribute("aria-pressed", String(paused)); return; }
    if (b.dataset.v === "burst") { if (paused) $('[data-v="pause"]', host).click(); for (let k = 0; k < 18; k++) setTimeout(spawn, k * 40); }
    else {
      if (down.has(1)) { down.delete(1); assign = [0, 1, 2]; b.textContent = "kill c2"; }
      else { down.add(1); assign = [0, 0, 2]; b.textContent = "revive c2"; }
      drawWires();
      toast(down.has(1) ? "consumer-2 left the group → P1 rebalanced to consumer-1" : "consumer-2 rejoined → partitions rebalanced");
    }
  }));

  function step(now) {
    if (!host.isConnected) return;
    // Advance by real elapsed time in small sub-steps, so it keeps moving even when the
    // browser throttles frames (Low Power Mode, battery saver, embedded views).
    let rem = Math.max(0, Math.min(1, (now - last) / 1000)) * pace; last = now;
    if (visible && !document.hidden && !paused) while (rem > 0) {
      const dt = Math.min(0.05, rem); rem -= dt;
      acc += dt * 3.2;
      while (acc >= 1) { acc--; spawn(); }
      // per-partition queue position
      const queue = [[], [], []];
      pk.forEach((p) => p.stage === 1 && queue[p.part].push(p));
      queue.forEach((q) => q.sort((a, b) => b.t - a.t));
      for (let k = pk.length - 1; k >= 0; k--) {
        const p = pk[k], py = P[p.part];
        if (p.stage === 0) {                        // producer -> partition
          p.t += dt * 1.6;
          const t = Math.min(1, p.t), y0 = prodY[p.prod] + 22;
          p.x = bez(114, 150, 160, 206, t); p.y = bez(y0, y0, py, py, t);
          if (t >= 1) { p.stage = 1; p.t = 0; offsets[p.part]++; }
        } else if (p.stage === 1) {                 // inside partition log
          const idx = queue[p.part].indexOf(p);
          const target = 352 - idx * 12;
          p.x += Math.max(0, Math.min(target - p.x, 90 * dt));
          p.y = py;
          const consumer = assign[p.part];
          const slowdown = down.size ? 0.55 : 1;    // one consumer doing double duty
          if (idx === 0 && p.x >= 350) { p.t += dt * 2.2 * slowdown; if (p.t > 1) { p.stage = 2; p.t = 0; p.c = consumer; } }
        } else {                                    // partition -> consumer
          p.t += dt * 1.8;
          const t = Math.min(1, p.t), cy = consY[p.c] + 22;
          p.x = bez(364, 400, 410, 446, t); p.y = bez(py, py, cy, cy, t);
          if (t >= 1) { p.el.remove(); pk.splice(k, 1); consumed++; continue; }
        }
        p.el.setAttribute("cx", p.x.toFixed(1)); p.el.setAttribute("cy", p.y.toFixed(1));
      }
      offsets.forEach((o, i) => ($("#off" + i, svg).textContent = "offset " + o));
      $("#vp", host).textContent = produced.toLocaleString();
      $("#vc", host).textContent = consumed.toLocaleString();
      $("#vl", host).textContent = pk.filter((p) => p.stage < 2).length;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ==========================================================
   Views
   ========================================================== */
function artFor(seed) {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
  let g = "";
  for (let r = 0; r < 14; r++) {
    const y = 20 + r * 22; let x = 20;
    while (x < 560) {
      const w = 8 + rnd() * 60, hot = rnd() < 0.07;
      g += `<rect x="${x.toFixed(0)}" y="${y}" width="${w.toFixed(0)}" height="6" rx="3" fill="${hot ? "var(--accent)" : "currentColor"}" opacity="${hot ? 1 : (0.1 + rnd() * 0.3).toFixed(2)}"/>`;
      x += w + 6 + rnd() * 10;
    }
  }
  return `<svg viewBox="0 0 580 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}<text x="24" y="316" font-family="JetBrains Mono, monospace" font-size="11" fill="currentColor" opacity=".55">${esc(seed)}.md</text></svg>`;
}

const coverImg = (p, eager) =>
  `<img src="img/covers/${p.slug}.png" alt="${esc(p.title)}" width="1200" height="627"${eager ? "" : ' loading="lazy"'} decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('span'),{innerHTML:artFor('${p.slug}')}))">`;
const tagChips = (tags) => tags.map((t) => `<span class="chip">#${esc(t)}</span>`).join("");
const metaLine = (p) => `<div class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="dot"></span><span>${p.mins} min read</span>${p.demo ? '<span class="badge-demo">Interactive</span>' : ""}</div>`;

function viewHome() {
  const feat = POSTS.find((p) => p.featured) || POSTS[0];
  const rest = POSTS.filter((p) => p !== feat).slice(0, 4);
  return `
  <section class="hero wrap">
    <div class="hero-grid">
      <div>
        <div class="hero-id reveal">
          <span class="status"><span class="pulse"></span>Open to senior backend roles · immediate joiner</span>
        </div>
        <h1 class="reveal">Systems that stay <em>correct</em> when the network doesn’t.</h1>
        <p class="pitch reveal">I’m <b>Waquar Imdad</b>, a senior backend engineer with 6+ years of <b>Java, Spring Boot, Kafka and Redis</b> across railway operations, BNPL lending and healthcare. This is where I write down what I’ve learned about retries, races and the failure modes that only show up in production.</p>
        <div class="cta reveal">
          <a class="btn btn-primary" href="#/blog">Read the writing ${ICON.right}</a>
          <a class="btn btn-ghost" href="${CONFIG.cv}" download>${ICON.down} Download CV</a>
        </div>
        <div class="socials reveal">
          <a href="${CONFIG.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON.li}</a>
          <a href="${CONFIG.github}" target="_blank" rel="noopener" aria-label="GitHub">${ICON.gh}</a>
          <a href="mailto:${CONFIG.email}" aria-label="Email">${ICON.mail}</a>
        </div>
      </div>
      <div class="viz reveal" id="heroViz"></div>
    </div>
    <div class="stats reveal">
      <div class="stat"><b>6+</b><span>years shipping Java backends</span></div>
      <div class="stat"><b>3</b><span>industries · rail, lending, health</span></div>
      <div class="stat"><b>${POSTS.length}</b><span>deep-dive articles, ${POSTS.filter((p) => p.demo).length} interactive</span></div>
      <div class="stat"><b>Now</b><span>available · can join immediately</span></div>
    </div>
  </section>

  <section class="section wrap" id="work">
    <div class="section-head reveal">
      <div><div class="eyebrow">01 — Selected work</div><h2 class="h2">Where I’ve <em>built</em></h2></div>
      <p class="lede">Three domains with very different failure costs: a late train, a double charge, a wrong patient record. Same discipline in each.</p>
    </div>
    <div class="work">
      ${WORK.map((w, i) => `
      <article class="case reveal">
        <div class="case-n">0${i + 1}</div>
        <div>
          <div class="case-meta">${esc(w.co)}</div>
          <h3>${esc(w.title)}</h3>
          <p>${esc(w.summary)}</p>
          <ul>${w.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        </div>
        <dl class="case-side">
          <div><dt>Role</dt><dd>${esc(w.role)}</dd></div>
          <div><dt>When</dt><dd>${esc(w.when)}</dd></div>
          <div><dt>Stack</dt><dd class="tags">${w.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</dd></div>
        </dl>
      </article>`).join("")}
    </div>
  </section>

  <section class="section wrap" id="writing">
    <div class="section-head reveal">
      <div><div class="eyebrow">02 — Writing</div><h2 class="h2">Field <em>notes</em></h2></div>
      <a class="btn btn-ghost" href="#/blog">All articles ${ICON.right}</a>
    </div>
    <a class="feat reveal" href="#/blog/${feat.slug}">
      <div class="feat-body">
        <div class="eyebrow">Featured</div>
        <h3>${esc(feat.title)}</h3>
        <p>${esc(feat.dek)}</p>
        ${metaLine(feat)}
        <div class="tags">${tagChips(feat.tags)}</div>
      </div>
      <div class="feat-art">${artFor(feat.slug)}</div>
    </a>
    <div class="posts">
      ${rest.map((p) => `
      <a class="pcard reveal" href="#/blog/${p.slug}">
        <div class="pcard-img">${coverImg(p)}</div>
        <span class="arrow">${ICON.arrow}</span>
        ${metaLine(p)}
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.dek)}</p>
        <div class="tags">${tagChips(p.tags.slice(0, 3))}</div>
      </a>`).join("")}
    </div>
  </section>

  <section class="section wrap" id="experience">
    <div class="xp">
      <div class="xp-side reveal">
        <div class="eyebrow">03 — Experience</div>
        <h2 class="h2">The <em>path</em></h2>
        <p class="lede" style="margin-top:18px">From healthcare to fintech to railways — each step raised the stakes on correctness and scale.</p>
        <div class="cta"><a class="btn btn-ghost" href="${CONFIG.cv}" download>${ICON.down} Full CV</a></div>
      </div>
      <div class="tl">
        ${WORK.map((w, i) => `
        <div class="job reveal ${i === 0 ? "now" : ""}">
          <time>${esc(w.when)}<small>India</small></time>
          <div>
            <h3>${esc(w.co.split(" · ")[0])}</h3>
            <div class="role">${esc(w.role)}${w.co.includes("·") ? " · " + esc(w.co.split(" · ")[1]) : ""}</div>
            <p>${esc(w.summary)}</p>
            <div class="tags">${w.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
          </div>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section wrap" id="principles">
    <div class="section-head reveal"><div><div class="eyebrow">04 — How I work</div><h2 class="h2">Three <em>habits</em></h2></div></div>
    <div class="principles">
      ${PRINCIPLES.map(([t, d], i) => `<div class="pr reveal"><div class="n">0${i + 1}</div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join("")}
    </div>
  </section>

  <section class="section wrap" id="skills">
    <div class="section-head reveal"><div><div class="eyebrow">05 — Toolbox</div><h2 class="h2">What I <em>reach</em> for</h2></div></div>
    <div class="skills reveal">
      ${SKILLS.map(([h, list]) => `<div class="sk"><h4>${esc(h)}</h4><div class="tags">${list.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`).join("")}
    </div>
  </section>

  <section class="wrap" id="contact">
    <div class="contact reveal">
      <svg class="contact-art" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".6">${Array.from({ length: 12 }, (_, k) => `<circle cx="100" cy="100" r="${8 + k * 8}"/>`).join("")}</g></svg>
      <div class="eyebrow">06 — Contact</div>
      <h2>Let’s build something <em>reliable.</em></h2>
      <p>I’m looking for senior backend roles where correctness and scale both matter. I can join immediately — email is the fastest way to reach me.</p>
      <div class="cta">
        <a class="btn btn-primary" href="mailto:${CONFIG.email}">${ICON.mail} ${esc(CONFIG.email)}</a>
        <a class="btn btn-ghost" href="${CONFIG.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON.li} LinkedIn</a>
        <a class="btn btn-ghost" href="${CONFIG.cv}" download>${ICON.down} CV</a>
      </div>
    </div>
  </section>`;
}

const blogState = { tag: null, q: "" };

function viewBlog() {
  const counts = {};
  POSTS.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
  const tags = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  return `
  <section class="wrap page-head">
    <div class="eyebrow reveal">Writing · ${POSTS.length} articles</div>
    <h1 class="reveal">Field notes on <em>backends</em></h1>
    <p class="lede reveal">Long-form, code-first write-ups on the problems that keep backend systems up at night — idempotency, caching, locking, rate limits and Kafka.</p>
  </section>
  <section class="wrap">
    <div class="filters">
      <label class="search">${ICON.search}<input id="blogQ" type="search" placeholder="Filter articles…" value="${esc(blogState.q)}" aria-label="Filter articles"></label>
      <button class="tagbtn" data-tag="" aria-pressed="${!blogState.tag}">all<span class="ct">${POSTS.length}</span></button>
      ${tags.map((t) => `<button class="tagbtn" data-tag="${esc(t)}" aria-pressed="${blogState.tag === t}">#${esc(t)}<span class="ct">${counts[t]}</span></button>`).join("")}
    </div>
    <div class="list" id="blogList"></div>
  </section>`;
}

function renderBlogList() {
  const list = $("#blogList"); if (!list) return;
  const q = blogState.q.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const hit = (p) => (!blogState.tag || p.tags.includes(blogState.tag)) &&
    words.every((w) => (p.title + " " + p.dek + " " + p.tags.join(" ") + " " + p.body).toLowerCase().includes(w));
  const mark = (s) => { let h = esc(s); words.forEach((w) => { h = h.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>"); }); return h; };
  const ps = POSTS.filter(hit);
  list.innerHTML = ps.length ? ps.map((p) => `
    <a class="row" href="#/blog/${p.slug}">
      <div class="row-img">${coverImg(p)}<time datetime="${p.date}">${fmtDate(p.date)}</time></div>
      <div><h3>${mark(p.title)}</h3><p>${mark(p.dek)}</p><div class="tags" style="margin-top:12px">${tagChips(p.tags)}${p.demo ? ' <span class="badge-demo">Interactive</span>' : ""}</div></div>
      <span class="rt">${p.mins} min</span>
    </a>`).join("") : `<div class="empty">Nothing matches “${esc(blogState.q)}”. Try <a href="#/blog" data-clear>clearing the filter</a>.</div>`;
}

function viewPost(p) {
  const { html, toc } = md(p.body);
  const idx = POSTS.indexOf(p), newer = POSTS[idx - 1], older = POSTS[idx + 1];
  return `
  <article>
    <header class="wrap"><div class="post-head">
      <a class="back" href="#/blog">← All writing</a>
      <h1>${esc(p.title)}</h1>
      <p class="dek">${esc(p.dek)}</p>
      <div class="meta" style="gap:18px"><span class="mark" style="width:26px;height:26px;font-size:10px;border-radius:7px">WI</span><span>${CONFIG.name}</span><span class="dot"></span><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="dot"></span><span>${p.mins} min read</span></div>
      <div class="tags" style="margin-top:18px">${p.tags.map((t) => `<a class="chip" style="text-decoration:none" href="#/blog?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join("")}</div>
    </div>
    <figure class="post-cover">${coverImg(p, true)}</figure></header>
    <div class="wrap post-layout">
      <div>
        <div class="prose" id="prose">${html}</div>
        <div class="author">
          <span class="mark">WI</span>
          <div><b>${CONFIG.name}</b><p>Senior backend engineer — Java, Spring Boot, Kafka, Redis, AWS. Open to new roles. <a href="#/contact">Get in touch →</a></p></div>
        </div>
        <nav class="post-foot" aria-label="More articles">
          ${older ? `<a class="nextprev" href="#/blog/${older.slug}"><span>← Older</span><b>${esc(older.title)}</b></a>` : "<span></span>"}
          ${newer ? `<a class="nextprev r" href="#/blog/${newer.slug}"><span>Newer →</span><b>${esc(newer.title)}</b></a>` : ""}
        </nav>
      </div>
      <aside class="toc" aria-label="On this page">
        <h4>On this page</h4>
        <ol>${toc.map((t) => `<li><a href="#${t.id}" data-toc="${t.id}">${esc(t.text)}</a></li>`).join("")}</ol>
        <div class="actions"><button type="button" data-act="copy-link">Copy link</button><button type="button" data-act="top">↑ Top</button></div>
      </aside>
    </div>
  </article>`;
}

function view404() {
  return `<section class="wrap page-head"><div class="eyebrow">404</div><h1>Lost in <em>transit</em></h1><p class="lede">That page isn’t here — maybe it was consumed by another partition.</p><div class="cta"><a class="btn btn-primary" href="#/">Go home</a><a class="btn btn-ghost" href="#/blog">Browse writing</a></div></section>`;
}

/* ==========================================================
   Router
   ========================================================== */
const app = $("#app");
let currentPost = null;
const SECTIONS = ["work", "experience", "writing", "skills", "contact", "principles"];

function route() {
  const raw = location.hash.replace(/^#/, "") || "/";
  // in-page anchors inside a post (e.g. #idempotency)
  if (!raw.startsWith("/")) { const t = document.getElementById(raw); if (t) t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query || "");
  currentPost = null;
  let navKey = "", scrollTo = null;

  if (!parts.length || SECTIONS.includes(parts[0])) {
    if (!$("#heroViz")) { app.innerHTML = viewHome(); afterRender(); }
    scrollTo = parts[0] || null; navKey = parts[0] || "";
    document.title = `${CONFIG.name} — Backend Engineer`;
  } else if (parts[0] === "blog" && !parts[1]) {
    blogState.tag = params.get("tag");
    app.innerHTML = viewBlog(); afterRender(); renderBlogList(); bindBlog();
    navKey = "blog"; document.title = `Writing — ${CONFIG.name}`;
    window.scrollTo(0, 0);
  } else if (parts[0] === "blog") {
    const p = POSTS.find((x) => x.slug === parts[1]);
    if (p) { currentPost = p; app.innerHTML = viewPost(p); afterRender(); bindPost(); document.title = `${p.title} — ${CONFIG.name}`; }
    else app.innerHTML = view404();
    navKey = "blog"; window.scrollTo(0, 0);
  } else { app.innerHTML = view404(); window.scrollTo(0, 0); }

  if (!CONFIG.linkedin) $$('a[aria-label="LinkedIn"], a[data-cfg-href="linkedin"]').forEach((a) => a.remove());
  $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === navKey));
  if (scrollTo) requestAnimationFrame(() => { const el = document.getElementById(scrollTo); if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
  else if (!parts.length) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  onScroll();
}

function afterRender() {
  mountHeroViz($("#heroViz"));
  mountFigs(app);
  mountDemos(app);
  $$("[data-copy]", app).forEach((b) => b.addEventListener("click", () => {
    navigator.clipboard?.writeText($("code", b.closest(".code")).innerText).then(() => { b.textContent = "Copied ✓"; setTimeout(() => (b.textContent = "Copy"), 1400); });
  }));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal", app).forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms"; io.observe(el); });
}

function bindBlog() {
  const q = $("#blogQ");
  q.addEventListener("input", () => { blogState.q = q.value; renderBlogList(); });
  $$(".tagbtn").forEach((b) => b.addEventListener("click", () => {
    blogState.tag = b.dataset.tag || null;
    $$(".tagbtn").forEach((x) => x.setAttribute("aria-pressed", String((x.dataset.tag || null) === blogState.tag)));
    history.replaceState(null, "", "#/blog" + (blogState.tag ? "?tag=" + encodeURIComponent(blogState.tag) : ""));
    renderBlogList();
  }));
  $("#blogList").addEventListener("click", (e) => {
    if (!e.target.matches("[data-clear]")) return;
    e.preventDefault(); blogState.q = ""; blogState.tag = null;
    history.replaceState(null, "", "#/blog"); route();
  });
}

function bindPost() {
  $$(".toc a[data-toc], .prose h2 .anchor").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href").slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }));
  $('[data-act="copy-link"]')?.addEventListener("click", () => copy(location.href, "Link copied"));
  $('[data-act="top"]')?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
function spyToc() {
  const links = $$(".toc a[data-toc]"); if (!links.length) return;
  let cur = null;
  $$(".prose h2").forEach((h) => { if (h.getBoundingClientRect().top < innerHeight * 0.3) cur = h.id; });
  links.forEach((l) => l.classList.toggle("on", l.dataset.toc === cur));
}

/* ==========================================================
   Chrome: scroll, theme, toast, palette, shortcuts
   ========================================================== */
const bar = $("#bar"), progress = $("#progress");
function onScroll() {
  bar.classList.toggle("scrolled", scrollY > 8);
  const prose = $("#prose");
  if (currentPost && prose) {
    const r = prose.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight * 0.6)));
    progress.style.width = pct * 100 + "%";
  } else progress.style.width = "0";
  if (currentPost) spyToc();
}
addEventListener("scroll", onScroll, { passive: true });

function effectiveTheme() {
  return document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function toggleTheme() {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
}
$("#themeBtn").addEventListener("click", toggleTheme);

let toastT;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
}
function copy(text, msg) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(msg), () => toast(text));
}

/* command palette */
const cmdk = $("#cmdk"), cmdkInput = $("#cmdkInput"), cmdkList = $("#cmdkList");
let cmdkItems = [], cmdkSel = 0;
function commands() {
  const go = (h) => () => (location.hash = h);
  return [
    { g: "Pages", t: "Home", s: "", ic: ICON.home, run: go("#/") },
    { g: "Pages", t: "Writing", s: `${POSTS.length} articles`, ic: ICON.doc, run: go("#/blog") },
    { g: "Pages", t: "Selected work", s: "section", ic: ICON.hash, run: go("#/work") },
    { g: "Pages", t: "Experience", s: "section", ic: ICON.hash, run: go("#/experience") },
    { g: "Pages", t: "Toolbox / skills", s: "section", ic: ICON.hash, run: go("#/skills") },
    { g: "Pages", t: "Contact", s: "section", ic: ICON.hash, run: go("#/contact") },
    ...POSTS.map((p) => ({ g: "Articles", t: p.title, s: p.mins + " min", k: p.tags.join(" ") + " " + p.dek, ic: ICON.doc, run: go("#/blog/" + p.slug) })),
    ...[...new Set(POSTS.flatMap((p) => p.tags))].map((t) => ({ g: "Topics", t: "#" + t, s: "filter", ic: ICON.hash, run: go("#/blog?tag=" + encodeURIComponent(t)) })),
    { g: "Actions", t: "Toggle dark / light theme", s: "T", ic: ICON.moon, run: toggleTheme },
    { g: "Actions", t: "Copy email address", s: "", ic: ICON.mail, run: () => copy(CONFIG.email, "Email copied") },
    { g: "Actions", t: "Copy link to this page", s: "", ic: ICON.link, run: () => copy(location.href, "Link copied") },
    { g: "Actions", t: "Download CV", s: "PDF", ic: ICON.down, run: () => { const a = document.createElement("a"); a.href = CONFIG.cv; a.download = ""; a.click(); } },
    ...(CONFIG.linkedin ? [{ g: "Actions", t: "Open LinkedIn", s: "↗", ic: ICON.li, run: () => open(CONFIG.linkedin, "_blank", "noopener") }] : []),
    { g: "Actions", t: "Open GitHub", s: "↗", ic: ICON.gh, run: () => open(CONFIG.github, "_blank", "noopener") },
  ];
}
function renderCmdk() {
  const words = cmdkInput.value.toLowerCase().split(/\s+/).filter(Boolean);
  cmdkItems = commands().filter((c) => words.every((w) => (c.t + " " + (c.k || "") + " " + c.g).toLowerCase().includes(w)));
  if (!words.length) cmdkItems = cmdkItems.filter((c) => c.g !== "Topics");
  cmdkSel = Math.min(cmdkSel, Math.max(0, cmdkItems.length - 1));
  let g = "", html = "";
  cmdkItems.forEach((c, i) => {
    if (c.g !== g) { g = c.g; html += `<div class="cmdk-group">${g}</div>`; }
    html += `<div class="cmdk-item" role="option" data-i="${i}" aria-selected="${i === cmdkSel}"><span class="ic">${c.ic}</span><span class="t">${esc(c.t)}</span><span class="s">${esc(c.s)}</span></div>`;
  });
  cmdkList.innerHTML = html || `<div class="empty" style="padding:28px">No results for “${esc(cmdkInput.value)}”</div>`;
  $(".cmdk-item[aria-selected=true]", cmdkList)?.scrollIntoView({ block: "nearest" });
}
function openCmdk() { cmdk.classList.add("open"); cmdkInput.value = ""; cmdkSel = 0; renderCmdk(); setTimeout(() => cmdkInput.focus(), 10); }
function closeCmdk() { cmdk.classList.remove("open"); }
function runCmdk(i) { const c = cmdkItems[i]; if (!c) return; closeCmdk(); c.run(); }
$("#openCmdk").addEventListener("click", openCmdk);
$("#footCmdk").addEventListener("click", (e) => { e.preventDefault(); openCmdk(); });
cmdk.addEventListener("click", (e) => { if (e.target === cmdk) closeCmdk(); });
cmdkInput.addEventListener("input", () => { cmdkSel = 0; renderCmdk(); });
cmdkList.addEventListener("click", (e) => { const it = e.target.closest(".cmdk-item"); if (it) runCmdk(+it.dataset.i); });
cmdkList.addEventListener("mousemove", (e) => {
  const it = e.target.closest(".cmdk-item"); if (!it || +it.dataset.i === cmdkSel) return;
  cmdkSel = +it.dataset.i; $$(".cmdk-item", cmdkList).forEach((x) => x.setAttribute("aria-selected", String(+x.dataset.i === cmdkSel)));
});
cmdkInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); cmdkSel = Math.min(cmdkItems.length - 1, cmdkSel + 1); renderCmdk(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); cmdkSel = Math.max(0, cmdkSel - 1); renderCmdk(); }
  else if (e.key === "Enter") { e.preventDefault(); runCmdk(cmdkSel); }
});

let gPending = 0;
addEventListener("keydown", (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk.classList.contains("open") ? closeCmdk() : openCmdk(); return; }
  if (e.key === "Escape" && cmdk.classList.contains("open")) { closeCmdk(); return; }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "/") { e.preventDefault(); openCmdk(); }
  else if (e.key === "t") toggleTheme();
  else if (e.key === "g") gPending = Date.now();
  else if (Date.now() - gPending < 800) {
    if (e.key === "h") location.hash = "#/";
    if (e.key === "b" || e.key === "w") location.hash = "#/blog";
    if (e.key === "c") location.hash = "#/contact";
    gPending = 0;
  }
});

/* boot */
$("#yr").textContent = new Date().getFullYear();
$$("[data-cfg-href]").forEach((a) => (a.href = CONFIG[a.dataset.cfgHref]));
addEventListener("hashchange", route);
route();

/* self-update: if the browser served a cached old page, reload once into the latest deploy */
(() => {
  const mine = (document.currentScript?.src.match(/[?&]v=(\d+)/) || [])[1];
  if (!mine || location.protocol === "file:") return;
  fetch("index.html", { cache: "no-store" }).then((r) => r.text()).then((html) => {
    const latest = (html.match(/app\.js\?v=(\d+)/) || [])[1];
    let key = "reloaded-for-" + latest;
    try { if (latest && latest !== mine && !sessionStorage.getItem(key)) { sessionStorage.setItem(key, "1"); location.reload(); } } catch (e) {}
  }).catch(() => {});
})();
