// Generates /p/<slug>/index.html for every post: a tiny page with its own
// Open Graph tags (so LinkedIn/WhatsApp/X show a proper preview) that
// immediately redirects to the in-app route #/blog/<slug>.
// Run after adding a post:  node tools/build-share-pages.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "posts.js"));
const SITE = "https://waquarimdad.github.io";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

for (const p of window.POSTS) {
  const url = `${SITE}/p/${p.slug}/`;
  const target = `/#/blog/${p.slug}`;
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)} — Waquar Imdad</title>
<meta name="description" content="${esc(p.dek)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.dek)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Waquar Imdad">
<meta property="og:image" content="${SITE}/img/covers/${p.slug}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
<meta property="article:author" content="Waquar Imdad">
<meta property="article:published_time" content="${p.date}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)});</script>
</head><body>
<p><a href="${target}">${esc(p.title)}</a></p>
</body></html>
`;
  const dir = path.join(root, "p", p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log(url);
}
