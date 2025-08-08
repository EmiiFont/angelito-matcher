import { Hono } from 'hono';
import { cors } from 'hono/cors';
import api from '@/api';

type Bindings = {
  RESEND_API_KEY: string;
};
const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use('/*', cors());

// Mount API routes
app.route('/api', api);

// With [assets] configuration, static files are automatically served by Cloudflare
// We only need to handle the SPA fallback for non-existent routes
app.get('*', async (c) => {
  const url = new URL(c.req.url);
  
  // Don't serve HTML for API routes
  if (url.pathname.startsWith('/api/')) {
    return c.text('Not Found', 404);
  }

  // For SPA routing - serve index.html for all non-API routes
  // Static assets (JS, CSS, images) are automatically handled by Cloudflare
  return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/logo-kygw735p.svg" />
    <title>Angelito Matcher</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" crossorigin href="/chunk-verh5ctz.css">
    <script type="module" crossorigin src="/chunk-0fj39e6p.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`);
});

export default app;
