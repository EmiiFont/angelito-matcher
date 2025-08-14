import express from 'express';
import { Resend } from 'resend';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// API routes
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello, world!',
    method: 'GET',
  });
});

app.put('/api/hello', (req, res) => {
  res.json({
    message: 'Hello, world!',
    method: 'PUT',
  });
});

app.post('/api/sendEmails', async (req, res) => {
  try {
    const { persons, matches, amount } = req.body;

    if (!Array.isArray(persons) || !Array.isArray(matches)) {
      return res.status(400).send('Invalid payload');
    }
    const giftAmount = Number(amount) || 0;

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
            from: "angelitomatcher@emiliofont.dev",
            to: recipient.email,
            subject: "Tu angelito",
            html: `<p>Hola, tu angelito es ${match.name}. El monto del regalo es RD$${giftAmount}</p>`,
          });
          console.log(`Email sent to ${recipient.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
        }

        if (fromIdx < matches.length - 1) {
          await delay(2000);
        }
      }
    }
    return res.send('sent');
  } catch (err) {
    console.error(err);
    return res.status(500).send('error');
  }
});

app.get('/api/hello/:name', (req, res) => {
  const name = req.params.name;
  res.json({
    message: `Hello, ${name}!`, 
  });
});

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
