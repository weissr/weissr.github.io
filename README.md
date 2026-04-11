# Gorka Leguina — personal website

This repository is the source for **[gorkaleguina.com](https://www.gorkaleguina.com)**, a static personal site **published with [GitHub Pages](https://pages.github.com/)**. Most of the content is in Spanish. It collects **social profiles**, **general outbound links**, and material related to **skiing, freeride, and trail running**.

## What’s in here

- **Landing page** (`index.html`) — profile header, link list, social networks, and footer with a copyright / all-rights-reserved notice.
- **Other static pages** in the repo use plain **HTML**, **CSS**, and **client-side JavaScript** only: for example, **search** and **filter** controls, **cards** with short descriptions, and **buttons** that open external destinations. There is **no backend** and no server-side processing.

There is no server-side code: plain HTML, CSS, and a little JavaScript where needed.

## Technical notes

GitHub Pages can run [Jekyll](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-and-jekyll) by default on `username.github.io` repos. This project is **fully custom static files**, so the repo includes a **`.nojekyll`** file at the root so GitHub serves the files as-is and does not try to process them with Jekyll.

If you fork or clone this pattern: keep `.nojekyll` if you are not using Jekyll; otherwise you may see build or path issues.

## Copyright

© Gorka Leguina. **All rights reserved.** This repository and the published website contain personal content. **No license is granted** to copy, redistribute, republish, adapt, or otherwise reuse text, layout, images, or other materials without **prior written permission**. (See the footer on the live site for the Spanish notice.)
