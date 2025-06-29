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

        await Promise.all(
          matches.map((toIdx: number, fromIdx: number) => {
            const recipient = persons[fromIdx];
            const match = persons[toIdx];

            if (!recipient?.email || !match?.name) return Promise.resolve();

            return resend.emails.send({
              from: "angelito@matcher.dev",
              to: recipient.email,
              subject: "Tu angelito",
              html: `<p>Hola, tu angelito es ${match.name}</p>`,
            });
          }),
        );

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
