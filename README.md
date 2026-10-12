# Prezent Vivo Admin Best Practices Guide

A one-page guide for customer admins: sidebar, search, and 12 short sections.
It is served by GitHub Pages and loaded into the Webflow page `/admin-guide`.

## Files

| File | What it is |
|---|---|
| `guide.js` | All content (the `PARTS`, `PAGES`, `GROUPS`, `CHECKLIST`, `ROLES`, `MONTHS`, `PLAN` objects) and the code that renders it |
| `guide.css` | Styles. The first line resets Webflow defaults so the guide looks the same inside Webflow |
| `img/` | Screenshots, referenced by key in `guide.js` (`users`, `licenses`, `int-enable`, …) |
| `index.html` | Standalone preview of the guide |

## Editing content

1. Edit the text in `guide.js` (or replace a screenshot in `img/` with the same file name).
2. Commit and push to `main`. GitHub Pages updates in about a minute.
3. In Webflow, bump the version on the `/admin-guide` page (`?v=1` → `?v=2`) in both the
   page head `<link>` and the Embed `<script>`, then publish. This makes browsers fetch the new files.

## How Webflow loads it

Page head custom code:

```html
<link rel="stylesheet" href="https://mehdi-touij.github.io/prezent-admin-guide/guide.css?v=1">
```

Embed element on the page:

```html
<div id="admin-guide-root"></div>
<script src="https://mehdi-touij.github.io/prezent-admin-guide/guide.js?v=1"></script>
```

Anything pushed to `main` runs on prezent.ai, so keep the branch protected and review changes.
