import { Hono } from 'hono';
import { Resend } from 'resend';

export const api = new Hono();

api.post('/sendEmails', async (c) => {
  try {
    const { persons, matches, amount } = await c.req.json();
    if (!Array.isArray(persons) || !Array.isArray(matches)) {
      return c.text('Invalid payload', 400);
    }

    const giftAmount = Number(amount) || 0;
    const apiKey = (c.env as any)?.RESEND_API_KEY || process.env.RESEND_API_KEY;
    const resend = new Resend(apiKey);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let fromIdx = 0; fromIdx < matches.length; fromIdx++) {
      const toIdx = matches[fromIdx];
      const recipient = persons[fromIdx];
      const match = persons[toIdx];

      if (recipient?.email && match?.name) {
        try {
          await resend.emails.send({
            from: 'angelitomatcher@emiliofont.dev',
            to: recipient.email,
            subject: 'Tu angelito',
            html: `<p>Hola, tu angelito es ${match.name}. El monto del regalo es RD$${giftAmount}</p>`,
          });
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
        }
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

api.get('/hello', (c) => {
  return c.json({
    message: 'Hello, world!',
    method: 'GET',
  });
});

api.put('/hello', (c) => {
  return c.json({
    message: 'Hello, world!',
    method: 'PUT',
  });
});

api.get('/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({
    message: `Hello, ${name}!`,
  });
});

export default api;
