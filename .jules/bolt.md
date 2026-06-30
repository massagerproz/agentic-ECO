## 2024-05-24 - Vercel SPA Routing and Asset 404s
**Learning:** A standard SPA rewrite rule (`{"source": "/(.*)", "destination": "/index.html"}`) on Vercel can cause a tricky issue where missing static assets (like images or chunks that should 404) return a 200 OK with the content of `index.html`. This leads to silent failures and confusing syntax errors in the browser when it tries to parse HTML as JS/CSS/images.
**Action:** Always use a dot-exclusion pattern `{"source": "/([^.]*)", "destination": "/index.html"}` for SPA rewrites to ensure paths with extensions (like `.js`, `.css`, `.png`) bypass the rewrite and correctly return a 404 if missing, while still allowing client-side routing for standard paths.

## 2024-05-24 - Animated Glassmorphism Backgrounds
**Learning:** Continuous CSS/Framer Motion animations (e.g. `scale` and translate `x`/`y`) on large DOM elements, especially those with heavy filters like `blur(40px)`, cause constant and expensive re-rasterization by the browser, leading to high CPU usage and jitter on lower-end devices.
**Action:** Always add `willChange: "transform"` to elements with continuous layout or transform animations to promote them to their own compositor layer, enforcing GPU acceleration and preventing continuous paint operations on the main thread.
