import { createDB } from './db/client';
import { items } from './db/schema';
import { createAuth } from './lib/auth';
import { EventsAPI } from './api/events';
import { ParticipantsAPI } from './api/participants';
import { RegistrationAPI } from './api/registration';
import { createEmailService } from './lib/email';
import { createMessagingService } from './lib/messaging';

function cors(origin: string) {

    const ALLOWED_ORIGINS = new Set([
        "http://localhost:5173",
        "https://myangelito.com",
    ]);
    const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://myangelito.com";
    return {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,HEAD",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
    };
}

export default {
    async fetch(request: Request, env: any) {
        const url = new URL(request.url);
        const db = createDB(env.DB);
        const auth = createAuth(db, env);

        // Initialize services
        let emailService, messagingService;
        try {
            emailService = createEmailService(env);
        } catch (error) {
            console.warn('Email service not configured:', error);
        }

        try {
            messagingService = createMessagingService(env);
        } catch (error) {
            console.warn('Messaging service not configured:', error);
        }

        const eventsAPI = new EventsAPI(db, emailService, messagingService);
        const participantsAPI = new ParticipantsAPI(db);
        const registrationAPI = new RegistrationAPI(db, emailService, messagingService);

        console.log("request URL:", url.pathname);

        // Helper function to extract user ID from session
        const getUserIdFromRequest = async (request: Request): Promise<string | null> => {
            try {
                const session = await auth.api.getSession({
                    headers: request.headers
                });
                return session?.user?.id || null;
            } catch (error) {
                console.error('Failed to get session:', error);
                return null;
            }
        };


        // ---- AUTH MOUNT ----
        if (url.pathname.startsWith("/api/auth")) {
            if (request.method === "OPTIONS" || request.method === "HEAD") {
                return new Response(null, { status: 204, headers: cors(origin) });
            }

            // IMPORTANT: don’t read/consume the body here
            const res = await auth.handler(request);

            // DEBUG: correctly log all Set-Cookie headers coming from Better Auth
            const cookies: string[] = [];
            for (const [k, v] of res.headers) {
                if (k.toLowerCase() === "set-cookie") cookies.push(v);
            }
            console.log("auth.handler Set-Cookie count:", cookies.length);
            if (cookies.length) console.log("First Set-Cookie:", cookies[0]);

            // If you need CORS, copy ALL headers incl. every Set-Cookie
            const hdrs = new Headers();
            for (const [k, v] of res.headers) {
                if (k.toLowerCase() === "set-cookie") hdrs.append(k, v);
                else hdrs.set(k, v);
            }
            const c = cors(origin);
            for (const [k, v] of Object.entries(c)) hdrs.set(k, v);

            return new Response(res.body, { status: res.status, headers: hdrs });
        }

        if (url.pathname.startsWith("/api/events")) {
            console.log("Events request URL:", url.pathname);
            console.log("Events request method:", request.method);
            const userId = await getUserIdFromRequest(request);
            return eventsAPI.handleRequest(request, url.pathname, userId || undefined);
        }

        if (url.pathname.startsWith("/api/participants")) {
            console.log("Participants request URL:", url.pathname);
            console.log("Participants request method:", request.method);
            const userId = await getUserIdFromRequest(request);
            return participantsAPI.handleRequest(request, url.pathname, userId || undefined);
        }

        if (url.pathname.startsWith("/api/register")) {
            console.log("Registration request URL:", url.pathname);
            console.log("Registration request method:", request.method);
            return registrationAPI.handleRequest(request, url.pathname);
        }

        if (url.pathname === "/api/items") {
            console.log("Handling /api/items request");
            if (request.method === "GET") {
                try {
                    const allItems = await db.select().from(items);
                    return Response.json(allItems);
                } catch (error) {
                    return Response.json({ error: "Failed to fetch items" }, { status: 500 });
                }
            }

            if (request.method === "POST") {

                console.log("Handling /api/items POST request");
                try {
                    const body = await request.json() as { name: string; description?: string };

                    if (!body.name) {
                        return Response.json({ error: "Name is required" }, { status: 400 });
                    }

                    const newItem = {
                        name: body.name,
                    };

                    console.log("Inserting new item:", newItem);
                    const result = await db.insert(items).values(newItem).returning();
                    return Response.json(result[0], { status: 201 });
                } catch (error) {
                    console.error(error);
                    return Response.json({ error: "Failed to create item" }, { status: 500 });
                }
            }
        }

        if (url.pathname.startsWith("/api/")) {
            return Response.json({
                name: "Cloudflare",
            });
        }

        return new Response(null, { status: 404 });
    },
};
