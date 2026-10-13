# Prezent Vivo Admin Best Practices Guide

A one-page guide for customer admins: sidebar, search, and 12 short sections.
It is served from this repo through the jsDelivr CDN and loaded into the Webflow page `/admin-guide`.

## Files

| File | What it is |
|---|---|
| `guide.js` / `guide.min.js` | All content (`PARTS`, `PAGES`, `GROUPS`, `CHECKLIST`, `ROLES`, `MONTHS`, `PLAN`) and the code that renders it. Webflow loads the `.min` file |
| `guide.css` / `guide.min.css` | Styles. The first line resets Webflow defaults so the guide looks the same inside Webflow |
| `img/` | Screenshots, referenced by key in `guide.js` (`users`, `licenses`, `int-enable`, …) |
| `index.html` | Standalone preview of the guide |
| `tools/build.sh` | Rebuilds everything above from a single-file prototype HTML |

## Updating the guide

From a new single-file prototype (the `prezent-vivo-admin-guide-prototype.html` export):

```sh
tools/build.sh path/to/prototype.html
```

Or edit `guide.js` / `guide.css` by hand, then run the two `npx esbuild` lines from `tools/build.sh`
so the `.min` files match.

Then release it:

1. Commit and push to `main`.
2. Tag the commit with the next version and push the tag:
   `git tag v2.0.1 && git push origin v2.0.1`
3. In Webflow, change the version in the `/admin-guide` page (`@v2.0.0` → `@v2.0.1`) in **both**
   the page head code and the Embed, then publish.

Each tag is cached by jsDelivr and browsers for a long time, so a new tag is the only way
visitors get new files. Old tags keep working, so rolling back is just changing the version back.

## How Webflow loads it

Page head custom code:

```html
<link rel="preload" href="https://cdn.jsdelivr.net/gh/Mehdi-Touij/prezent-admin-guide@v2.0.0/guide.min.js" as="script">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Mehdi-Touij/prezent-admin-guide@v2.0.0/guide.min.css">
```

Embed element on the page:

```html
<div id="admin-guide-root"></div>
<script src="https://cdn.jsdelivr.net/gh/Mehdi-Touij/prezent-admin-guide@v2.0.0/guide.min.js" async></script>
```

Why this is faster than the GitHub Pages setup it replaced:

- The site already loads other files from `cdn.jsdelivr.net`, so there is no extra connection to open.
- Versioned files are cached for days instead of 10 minutes.
- The script is preloaded in the head and runs `async`, so it no longer blocks the rest of the page.
- Screenshots are lazy-loaded with their size reserved, so they don't shift the layout.

Anything tagged here runs on prezent.ai, so keep the branch protected and review changes.
