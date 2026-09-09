# Gorka Leguina — personal website

This repository is the source for **[gorkaleguina.com](https://www.gorkaleguina.com)**, a static personal site published with [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/). GitHub holds the repository and version history; [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) deploys `main` on each push. Most of the content is in Spanish. It collects **social profiles**, **general outbound links**, and material related to **skiing, freeride, and trail running**.

## What’s in here

- **Landing page** (`index.html`) — profile header, link list, social networks, and footer with a copyright / all-rights-reserved notice.
- **Other static pages** in the repo use plain **HTML**, **CSS**, and **client-side JavaScript** only: for example, **search** and **filter** controls, **cards** with short descriptions, and **buttons** that open external destinations. There is **no backend** and no server-side processing.
- **`_redirects`** — HTTP redirects for affiliate-friendly URLs (no Worker script).

There is no server-side code: plain HTML, CSS, and a little JavaScript where needed.

## Technical notes

The project is fully custom static files. `wrangler.jsonc` publishes the repository root as assets. There is no build step; Cloudflare runs `npm run deploy` (Wrangler pinned in `package.json`).

Friendly URLs such as `/siroko` or `/amazon` are declared in `_redirects`. Hostname redirects (apex `gorkaleguina.com` → `www`) are configured in the Cloudflare dashboard, not in this repo.

## Copyright

© Gorka Leguina. **All rights reserved.** This repository and the published website contain personal content. **No license is granted** to copy, redistribute, republish, adapt, or otherwise reuse text, layout, images, or other materials without **prior written permission**. (See the footer on the live site for the Spanish notice.)
