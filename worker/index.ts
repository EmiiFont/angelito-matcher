import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDB } from './db/client';
import { items } from './db/schema';
import { createAuth } from './lib/auth';
import { EventsAPI } from './api/events';
import { ParticipantsAPI } from './api/participants';
import { RegistrationAPI } from './api/registration';
import { createEmailService } from './lib/email';
import { createMessagingService } from './lib/messaging';

type Bindings = {
    DB: D1Database;
    ENVIRONMENT: string;
    GOOGLE_CLIENT_ID: string;
    APPLE_CLIENT_ID: string;
    TWILIO_PHONE_NUMBER: string;
    FROM_EMAIL: string;
    MAILERSEND_API_KEY: string;
    FROM_NAME?: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_WHATSAPP_NUMBER?: string;
}

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/api/*', cors({
    origin: (origin) => {
        const ALLOWED_ORIGINS = new Set([
            "http://localhost:5173",
            "https://myangelito.com",
        ]);
        return ALLOWED_ORIGINS.has(origin) ? origin : "https://myangelito.com";
    },
    allowMethods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Auth endpoint
app.all('/api/auth/*', async (c) => {
    const db = createDB(c.env.DB);
    const auth = createAuth(db, c.env);

    if (c.req.method === "OPTIONS" || c.req.method === "HEAD") {
        return new Response(null, { status: 204 });
    }

    console.log(`Auth request URL: ${c.req.url}, method: ${c.req.method}`);
    const incomingCookies = c.req.header("cookie");
    console.log("auth request cookies for", c.req.path, ":", incomingCookies);

    const res = await auth.handler(c.req.raw);

    console.log("auth.handler status:", res.status);
    const errHeader = res.headers.get("x-better-auth-error");
    if (errHeader) console.log("auth handler error header:", errHeader);

    if (res.status >= 400) {
        const txt = await res.clone().text();
        console.log("auth.handler error body:", txt);
    }

    const cookies: string[] = [];
    for (const [k, v] of res.headers) {
        if (k.toLowerCase() === "set-cookie") cookies.push(v);
    }
    console.log("auth.handler Set-Cookie count:", cookies.length);
    if (cookies.length) console.log("First Set-Cookie:", cookies[0]);

    const hdrs = new Headers();
    for (const [k, v] of res.headers) {
        if (k.toLowerCase() === "set-cookie") hdrs.append(k, v);
        else hdrs.set(k, v);
    }

    return new Response(res.body, { status: res.status, headers: hdrs });
});

// Helper function to extract user ID from session
const getUserIdFromRequest = async (req: Request, env: Bindings): Promise<string | null> => {
    try {
        const db = createDB(env.DB);
        const auth = createAuth(db, env);
        const session = await auth.api.getSession({
            headers: req.headers
        });
        console.log("Session data:", session);
        return session?.user?.id || null;
    } catch (error) {
        console.error('Failed to get session:', error);
        return null;
    }
};

// Events endpoint
app.all('/api/events/*', async (c) => {
    const db = createDB(c.env.DB);
    let emailService, messagingService;
    try {
        emailService = createEmailService(c.env);
    } catch (error) {
        console.warn('Email service not configured:', error);
    }
    try {
        messagingService = createMessagingService(c.env);
    } catch (error) {
        console.warn('Messaging service not configured:', error);
    }
    const eventsAPI = new EventsAPI(db, emailService, messagingService);
    const userId = await getUserIdFromRequest(c.req.raw, c.env);
    return eventsAPI.handleRequest(c.req.raw, new URL(c.req.url).pathname, userId || undefined);
});

// Participants endpoint
app.all('/api/participants/*', async (c) => {
    const db = createDB(c.env.DB);
    const participantsAPI = new ParticipantsAPI(db);
    const userId = await getUserIdFromRequest(c.req.raw, c.env);
    return participantsAPI.handleRequest(c.req.raw, new URL(c.req.url).pathname, userId || undefined);
});

// Registration endpoint
app.all('/api/register/*', async (c) => {
    const db = createDB(c.env.DB);
    let emailService, messagingService;
    try {
        emailService = createEmailService(c.env);
    } catch (error) {
        console.warn('Email service not configured:', error);
    }
    try {
        messagingService = createMessagingService(c.env);
    } catch (error) {
        console.warn('Messaging service not configured:', error);
    }
    const registrationAPI = new RegistrationAPI(db, emailService, messagingService);
    return registrationAPI.handleRequest(c.req.raw, new URL(c.req.url).pathname);
});

// Items endpoint
app.get('/api/items', async (c) => {
    const db = createDB(c.env.DB);
    try {
        const allItems = await db.select().from(items);
        return c.json(allItems);
    } catch (error) {
        return c.json({ error: "Failed to fetch items" }, 500);
    }
});

app.post('/api/items', async (c) => {
    const db = createDB(c.env.DB);
    try {
        const body = await c.req.json() as { name: string; description?: string };

        if (!body.name) {
            return c.json({ error: "Name is required" }, 400);
        }

        const newItem = {
            name: body.name,
        };

        const result = await db.insert(items).values(newItem).returning();
        return c.json(result[0], 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to create item" }, 500);
    }
});

export default app;
