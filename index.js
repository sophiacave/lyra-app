// index.js — Like One custom server entry point.
//
// Wraps Next.js (App Router + Pages Router) inside an Express app so we can
// layer in non-Next concerns (health checks, request logging, future webhook
// pre-processing) without touching Next routing. All /api routes still live
// under app/api/* and pages/api/* — Next handles them via the request handler.
//
// Run:
//   node index.js          # production
//   PORT=4000 node index.js
//
// For dev, prefer `next dev` (HMR). This server boots Next in dev mode too if
// NODE_ENV !== 'production', but `next dev` is the canonical dev command.

import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();

  const server = express();

  // Lightweight health probe — useful for uptime checks and load balancers.
  // Mounted before the Next handler so it bypasses Next routing.
  server.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  // Hand everything else (pages, app routes, /api/*, static assets) to Next.
  server.all(/.*/, (req, res) => handle(req, res));

  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('[server] failed to start', err);
      process.exit(1);
    }
    console.log(`[server] ready on http://${hostname}:${port} (dev=${dev})`);
  });
}

main().catch((err) => {
  console.error('[server] fatal', err);
  process.exit(1);
});
