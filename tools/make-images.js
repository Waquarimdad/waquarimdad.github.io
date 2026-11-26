// Generates images for the site with ImageMagick:
//   img/covers/<slug>.png   1200x627 article covers (cards, post headers, link previews)
//   img/linkedin-banner.png 1584x396 LinkedIn background photo
// Run:  node tools/make-images.js
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "posts.js"));

const F = "/System/Library/Fonts/Supplemental";
const SERIF = `${F}/Georgia.ttf`, SERIF_I = `${F}/Georgia Italic.ttf`;
const MONO = `${F}/Courier New.ttf`, MONO_B = `${F}/Courier New Bold.ttf`;
const INK = "#17140f", PAPER = "#f5f2ea", ACC = "#e2491f", OK = "#5cc584", DIM = "#8a8377";
const out = (p) => { fs.mkdirSync(path.dirname(p), { recursive: true }); return p; };
const magick = (args) => execFileSync("magick", args, { stdio: "inherit" });

// right-hand motif per article, drawn in a 300x300 box at (x0,y0)
function motif(slug, x0, y0) {
  const d = [];
  const L = (s) => d.push("-draw", s);
  d.push("-fill", "none", "-strokewidth", "4");
  if (slug.startsWith("idempotency")) {
    d.push("-stroke", DIM); L(`line ${x0},${y0 + 90} ${x0 + 170},${y0 + 150}`); L(`line ${x0},${y0 + 210} ${x0 + 170},${y0 + 150}`);
    d.push("-stroke", ACC); L(`circle ${x0 + 210},${y0 + 150} ${x0 + 250},${y0 + 150}`);
    d.push("-stroke", OK); L(`line ${x0 + 250},${y0 + 150} ${x0 + 300},${y0 + 150}`);
    d.push("-stroke", "none", "-fill", PAPER); L(`circle ${x0},${y0 + 90} ${x0 + 9},${y0 + 90}`); L(`circle ${x0},${y0 + 210} ${x0 + 9},${y0 + 210}`);
    d.push("-font", MONO_B, "-pointsize", "26", "-fill", ACC, "-annotate", `+${x0 + 196}+${y0 + 159}`, "1");
  } else if (slug.startsWith("rate-limiting")) {
    d.push("-stroke", PAPER); L(`line ${x0 + 60},${y0 + 70} ${x0 + 80},${y0 + 260}`); L(`line ${x0 + 240},${y0 + 70} ${x0 + 220},${y0 + 260}`); L(`line ${x0 + 80},${y0 + 260} ${x0 + 220},${y0 + 260}`);
    d.push("-stroke", "none", "-fill", ACC); L(`rectangle ${x0 + 84},${y0 + 170} ${x0 + 216},${y0 + 256}`);
    for (let i = 0; i < 4; i++) L(`circle ${x0 + 120 + i * 22},${y0 + 20 + (i % 2) * 22} ${x0 + 127 + i * 22},${y0 + 20 + (i % 2) * 22}`);
  } else if (slug.startsWith("redis-distributed-locks")) {
    d.push("-stroke", PAPER, "-strokewidth", "10"); L(`arc ${x0 + 90},${y0 + 30} ${x0 + 210},${y0 + 170} 180,360`); L(`line ${x0 + 90},${y0 + 100} ${x0 + 90},${y0 + 130}`); L(`line ${x0 + 210},${y0 + 100} ${x0 + 210},${y0 + 130}`);
    d.push("-stroke", "none", "-fill", ACC); L(`roundrectangle ${x0 + 60},${y0 + 130} ${x0 + 240},${y0 + 270} 16,16`);
    d.push("-font", MONO_B, "-pointsize", "34", "-fill", INK, "-annotate", `+${x0 + 112}+${y0 + 213}`, "#34");
  } else if (slug.startsWith("zero-downtime")) {
    d.push("-stroke", DIM, "-strokewidth", "3", "-fill", "none");
    for (let i = 0; i < 3; i++) d.push("-draw", `roundrectangle ${x0 + i * 100},${y0 + 90} ${x0 + i * 100 + 80},${y0 + 170} 12,12`);
    d.push("-stroke", "none", "-fill", OK, "-draw", `roundrectangle ${x0 + 210},${y0 + 100} ${x0 + 270},${y0 + 160} 8,8`);
    d.push("-fill", "#3a352c", "-draw", `roundrectangle ${x0 + 10},${y0 + 100} ${x0 + 70},${y0 + 160} 8,8`);
    d.push("-fill", PAPER, "-draw", `roundrectangle ${x0 + 110},${y0 + 100} ${x0 + 170},${y0 + 160} 8,8`);
    d.push("-stroke", ACC, "-strokewidth", "5", "-draw", `line ${x0 + 20},${y0 + 230} ${x0 + 280},${y0 + 230}`, "-draw", `line ${x0 + 266},${y0 + 220} ${x0 + 282},${y0 + 230}`, "-draw", `line ${x0 + 266},${y0 + 240} ${x0 + 282},${y0 + 230}`);
  } else if (slug.startsWith("transactional-outbox")) {
    d.push("-stroke", OK, "-strokewidth", "4", "-fill", "none", "-draw", `roundrectangle ${x0},${y0 + 40} ${x0 + 130},${y0 + 260} 14,14`);
    d.push("-stroke", PAPER, "-draw", `roundrectangle ${x0 + 20},${y0 + 70} ${x0 + 110},${y0 + 130} 8,8`, "-draw", `roundrectangle ${x0 + 20},${y0 + 170} ${x0 + 110},${y0 + 230} 8,8`);
    d.push("-stroke", ACC, "-draw", `line ${x0 + 120},${y0 + 200} ${x0 + 190},${y0 + 200}`, "-draw", `line ${x0 + 182},${y0 + 192} ${x0 + 192},${y0 + 200}`, "-draw", `line ${x0 + 182},${y0 + 208} ${x0 + 192},${y0 + 200}`);
    for (let p = 0; p < 3; p++) { const y = y0 + 150 + p * 40; d.push("-stroke", DIM, "-strokewidth", "3", "-draw", `roundrectangle ${x0 + 200},${y - 14} ${x0 + 300},${y + 14} 8,8`, "-stroke", "none", "-fill", p === 1 ? ACC : PAPER, "-draw", `circle ${x0 + 280},${y} ${x0 + 286},${y}`, "-draw", `circle ${x0 + 256},${y} ${x0 + 262},${y}`, "-fill", "none"); }
  } else if (slug.startsWith("cache")) {
    for (let i = 0; i < 4; i++) { d.push("-stroke", i === 0 ? ACC : PAPER, "-fill", "none"); L(`roundrectangle ${x0 + 40 + i * 12},${y0 + 60 + i * 50} ${x0 + 260 - i * 12},${y0 + 100 + i * 50} 10,10`); }
    d.push("-stroke", "none", "-fill", ACC); for (let i = 0; i < 6; i++) L(`circle ${x0 + 20 + i * 52},${y0 + 285} ${x0 + 26 + i * 52},${y0 + 285}`);
  } else {
    for (let p = 0; p < 3; p++) {
      const y = y0 + 70 + p * 80;
      d.push("-stroke", DIM, "-fill", "none", "-strokewidth", "3"); L(`roundrectangle ${x0},${y - 22} ${x0 + 300},${y + 22} 12,12`);
      d.push("-stroke", "none", "-fill", p === 1 ? ACC : PAPER);
      for (let k = 0; k < 6 - p; k++) L(`circle ${x0 + 270 - k * 40},${y} ${x0 + 280 - k * 40},${y}`);
    }
  }
  return d;
}

function grid(w, h, step, color) {
  const d = ["-stroke", color, "-strokewidth", "1"];
  for (let x = 0; x <= w; x += step) d.push("-draw", `line ${x},0 ${x},${h}`);
  for (let y = 0; y <= h; y += step) d.push("-draw", `line 0,${y} ${w},${y}`);
  return d;
}

// ---- covers ----
for (const p of window.POSTS) {
  const titleImg = path.join(require("os").tmpdir(), `t-${p.slug}.png`);
  magick(["-background", "none", "-fill", PAPER, "-font", SERIF, "-pointsize", "58", "-interline-spacing", "4",
    "-size", "720x", `caption:${p.title}`, titleImg]);
  const tag = "#" + p.tags.slice(0, 3).join("  #");
  magick(["-size", "1200x627", `xc:${INK}`, ...grid(1200, 627, 40, "#221e18"),
    "-stroke", "none",
    "-fill", ACC, "-draw", "rectangle 72,72 132,76",
    "-font", MONO_B, "-pointsize", "22", "-fill", ACC, "-annotate", "+72+116", tag.toUpperCase(),
    titleImg, "-geometry", "+72+150", "-composite",
    ...motif(p.slug, 840, 150),
    "-stroke", "none", "-fill", "#3a352c", "-draw", "rectangle 72,540 1128,541",
    "-font", MONO, "-pointsize", "22", "-fill", DIM, "-annotate", "+72+582", "Waquar Imdad  ·  Senior Backend Engineer",
    "-font", MONO_B, "-fill", PAPER, "-gravity", "SouthEast", "-annotate", "+72+45", "waquarimdad.github.io",
    "-depth", "8", out(path.join(root, "img/covers", p.slug + ".png"))]);
  fs.unlinkSync(titleImg);
  console.log("cover:", p.slug);
}

// ---- LinkedIn banner (1584x396). Left ~420px is covered by the profile photo on desktop. ----
{
  const W = 1584, H = 396;
  const d = ["-size", `${W}x${H}`, `xc:${INK}`, ...grid(W, H, 36, "#221e18"), "-stroke", "none"];
  // event-stream lanes across the right half
  const lanes = [120, 198, 276];
  lanes.forEach((y, i) => {
    d.push("-stroke", "#3a352c", "-strokewidth", "2", "-fill", "none", "-draw", `roundrectangle 1120,${y - 22} 1520,${y + 22} 12,12`);
    d.push("-stroke", "none", "-font", MONO, "-pointsize", "16", "-fill", DIM, "-annotate", `+1120+${y - 30}`, `P${i}`);
    const n = [8, 5, 7][i];
    for (let k = 0; k < n; k++) {
      const x = 1495 - k * 46, hot = (i === 1 && k === 2) || (i === 2 && k === 5);
      d.push("-fill", hot ? ACC : (k % 3 === 0 ? OK : PAPER), "-draw", `circle ${x},${y} ${x + 9},${y}`);
    }
  });
  d.push("-font", MONO, "-pointsize", "16", "-fill", DIM, "-annotate", "+1120+330", "orders.events  ·  3 partitions");
  d.push("-font", SERIF, "-pointsize", "60", "-fill", PAPER, "-annotate", "+470+150", "Systems that stay");
  d.push("-font", SERIF_I, "-pointsize", "60", "-fill", ACC, "-annotate", "+470+222", "correct");
  d.push("-font", SERIF, "-pointsize", "60", "-fill", PAPER, "-annotate", "+695+222", "under load.");
  d.push("-font", MONO, "-pointsize", "19", "-fill", "#bdb6a7", "-annotate", "+472+282", "Java · Spring Boot · Kafka · Redis · AWS · Microservices");
  d.push("-font", MONO_B, "-pointsize", "21", "-fill", ACC, "-annotate", "+472+322", "waquarimdad.github.io");
  d.push("-depth", "8", out(path.join(root, "img/linkedin-banner.png")));
  magick(d);
  console.log("banner: img/linkedin-banner.png");
}
