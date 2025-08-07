import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Resend } from 'resend';
import path from 'path';

const app = new Hono();

// Enable CORS for all routes
app.use('/*', cors());

// Serve static files from dist directory
app.use('/*', serveStatic({ 
  root: './dist',
  rewriteRequestPath: (path) => path.replace(/^\//, '')
}));

// API Routes
app.post('/api/sendEmails', async (c) => {
  try {
    const { persons, matches, amount } = await c.req.json();

    if (!Array.isArray(persons) || !Array.isArray(matches)) {
      return c.text('Invalid payload', 400);
    }

    const giftAmount = Number(amount) || 0;
    const resend = new Resend(process.env.RESEND_API_KEY);

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

// SPA fallback - serve index.html for all non-API routes
app.get('*', async (c) => {
  const url = new URL(c.req.url);
  
  // Don't serve HTML for API routes
  if (url.pathname.startsWith('/api/')) {
    return c.text('Not Found', 404);
  }

  try {
    // Serve index.html from dist directory
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    const file = Bun.file(indexPath);
    const content = await file.text();
    return c.html(content);
  } catch (error) {
    return c.text('Could not load app', 500);
  }
});

const port = 3001;
console.log(`🚀 Development server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});