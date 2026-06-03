# Nebaz AI Academy

Personal AI engineering education platform for Ethiopia. Static HTML site with Bootcamp+ curriculum, offline progress tracking, and live AI trends.

## Quick start

**Easiest (Windows):** double-click `START-SITE.bat` in the parent folder (`ai engineeing`).

Or in PowerShell:

```powershell
cd "D:\nebaz\ai engineeing"
.\serve-local.ps1
```

Your browser should open **http://127.0.0.1:5500/index.html** (port 8080 is blocked on many Windows PCs).

Do **not** use `file://` — use the local server so navigation, trends, and certificates work.

## Structure

- `courses/` — course hub pages
- `tutorials/` — lesson content
- `js/config.js` — site configuration
- `content/curriculum/` — Bootcamp+ metadata for `scripts/build-lesson.mjs`
- `vendor/` — local Prism & Highlight.js

## Deploy

See [DEPLOY.md](DEPLOY.md).
