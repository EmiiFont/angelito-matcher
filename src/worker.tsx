import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Resend } from 'resend';

type Bindings = {
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use('/*', cors());

// API Routes
app.post('/api/sendEmails', async (c) => {
  try {
    const { persons, matches, amount } = await c.req.json();

    if (!Array.isArray(persons) || !Array.isArray(matches)) {
      return c.text('Invalid payload', 400);
    }

    const giftAmount = Number(amount) || 0;
    const resend = new Resend(c.env.RESEND_API_KEY);

    console.log('Sending emails to:', persons.length, 'recipients');

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let fromIdx = 0; fromIdx < matches.length; fromIdx++) {
      const toIdx = matches[fromIdx];
      const recipient = persons[fromIdx];
      const match = persons[toIdx];

      console.log(recipient, match);

      if (recipient?.email && match?.name) {
        try {
          await resend.emails.send({
            from: 'angelitomatcher@emiliofont.dev',
            to: recipient.email,
            subject: 'Tu angelito',
            html: `<p>Hola, tu angelito es ${match.name}. El monto del regalo es RD$${giftAmount}</p>`,
          });
          console.log(`Email sent to ${recipient.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
        }

        // Wait 2 seconds before next email (except for the last one)
        if (fromIdx < matches.length - 1) {
          await delay(2000);
        }
      }
    }
    
    return c.text('sent');
  } catch (err) {
    console.error(err);
    return c.text('error', 500);
  }
});

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello, world!',
    method: 'GET',
  });
});

app.put('/api/hello', (c) => {
  return c.json({
    message: 'Hello, world!',
    method: 'PUT',
  });
});

app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({
    message: `Hello, ${name}!`,
  });
});

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