import { serve } from "bun";
import index from "./index.html";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/sendEmails": async req => {
      try {
        const { persons, matches } = await req.json();

        if (!Array.isArray(persons) || !Array.isArray(matches)) {
          return new Response("Invalid payload", { status: 400 });
        }

        console.log("Sending emails to:", persons.length, "recipients");

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
                html: `<p>Hola, tu angelito es ${match.name}</p>`,
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
        return new Response("sent");
      } catch (err) {
        console.error(err);
        return new Response("error", { status: 500 });
      }
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
