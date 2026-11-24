# Waquar Imdad — portfolio + blog

A static site you can host anywhere. It has no framework and no build step.

| File | What it is |
|---|---|
| `index.html` | The page shell: top bar, footer and ⌘K palette |
| `styles.css` | All styling, including light/dark themes |
| `app.js` | Router, views, diagrams, live demos and palette. **Edit `CONFIG` at the top** to set your email, LinkedIn, GitHub and CV |
| `posts.js` | The articles. Add an object to `POSTS` to publish a new one |
| `Waquar-Imdad-CV.pdf` | Put your CV here; the Download CV buttons link to it |

## Write a new post

Add an object to `posts.js` with `slug`, `title`, `dek`, `date` (YYYY-MM-DD), `tags` and `body`. The body uses light Markdown:

- `##` / `###` headings, which build the table of contents automatically
- `~~~java` … `~~~` code blocks, with syntax highlighting and a Copy button (java, sql, lua and bash are supported)
- `> !tldr`, `> !note` and `> !warn` callouts
- `| tables |`
- `:::fig name` for a diagram from `FIGS` in app.js
- `:::demo token-bucket` for the interactive simulator

Inside the template string, write inline-code backticks as `` \` ``.

## Preview locally

```bash
cd blog && python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy to GitHub Pages

1. Create a repo named `<your-github-username>.github.io`.
2. Push the contents of this folder to the repo root.
3. The site goes live at `https://<your-github-username>.github.io`.

## Keyboard shortcuts

`⌘K` / `/` opens search and commands, `T` switches the theme, `g h` goes home, `g b` goes to the writing page, and `g c` goes to contact.
