# Deploy Nebaz AI Academy

## Local development

From repo root:

```powershell
.\serve-local.ps1
```

Open the URL printed by the script (default tries port **5500** if 8080 is blocked on Windows).

## Cloudflare Pages (recommended)

1. Push `ethioai-academy` folder to GitHub.
2. Cloudflare Dashboard → Pages → Create project → Connect repo.
3. Build settings: **None** (static site). Publish directory: `/` (root of repo if mono-repo, or set to `ethioai-academy`).
4. Custom domain: optional.

## Netlify

```bash
cd ethioai-academy
npx netlify deploy --prod --dir=.
```

`netlify.toml` is included.

## AI tutor tiers

Edit `js/config.js`:

- `aiTier: 'offline'` — default, no API keys
- `aiTier: 'ollama'` — requires Ollama at localhost:11434
- `aiTier: 'cloud'` — requires `/api/ai-teacher` backend
