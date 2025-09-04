import { createDB } from './db/client';
import { items } from './db/schema';
import { createAuth } from './lib/auth';

function cors(origin: string) {

    const ALLOWED_ORIGINS = new Set([
        "http://localhost:5173",
        "https://myangelito.com",
    ]);
    console.log("CORS origin:", origin);
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
        const origin = request.headers.get("origin") || "http://localhost:5173";
        const db = createDB(env.DB);
        const auth = createAuth(db, env);

        // // Initialize services
        // let emailService, messagingService;
        // try {
        //     emailService = createEmailService(env);
        // } catch (error) {
        //     console.warn('Email service not configured:', error);
        // }
        //
        // try {
        //     messagingService = createMessagingService(env);
        // } catch (error) {
        //     console.warn('Messaging service not configured:', error);
        // }
        //
        // const eventsAPI = new EventsAPI(db, emailService, messagingService);
        // const participantsAPI = new ParticipantsAPI(db);
        // const registrationAPI = new RegistrationAPI(db, emailService, messagingService);
        //
        // console.log("request URL:", url.pathname);
        // console.log("request origin:", request.headers);

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
        console.log("Auth request URL:", url.pathname);
        if (url.pathname.startsWith("/api/auth/")) {
            if (request.method === "OPTIONS" || request.method === "HEAD") {

                console.log("request origin optioons head:", request.headers);
                return new Response(null, { status: 204, headers: cors(origin) });
            }

            // IMPORTANT: don’t read/consume the body here
            //
            console.log("request origin:", request.headers);
            const res = await auth.handler(request);
            console.log(res)

            const txt = await res.clone().text();
            console.log("auth.handler error body:", txt);


            console.log("auth.handler status:", res.status);
            const errHeader = res.headers.get("x-better-auth-error");
            if (errHeader) console.log("auth handler error header:", errHeader);

            // Only read the body if status >= 400, to avoid consuming success redirects
            if (res.status >= 400) {
                const txt = await res.clone().text();
                console.log("auth.handler error body:", txt);
            }

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

            return new Response(res.body, { status: res.status, headers: cors(origin) });
        }

        // if (url.pathname.startsWith("/api/events")) {
        //     console.log("Events request URL:", url.pathname);
        //     console.log("Events request method:", request.method);
        //     const userId = await getUserIdFromRequest(request);
        //     return eventsAPI.handleRequest(request, url.pathname, userId || undefined);
        // }
        //
        // if (url.pathname.startsWith("/api/participants")) {
        //     console.log("Participants request URL:", url.pathname);
        //     console.log("Participants request method:", request.method);
        //     const userId = await getUserIdFromRequest(request);
        //     return participantsAPI.handleRequest(request, url.pathname, userId || undefined);
        // }
        //
        // if (url.pathname.startsWith("/api/register")) {
        //     console.log("Registration request URL:", url.pathname);
        //     console.log("Registration request method:", request.method);
        //     return registrationAPI.handleRequest(request, url.pathname);
        // }
        //
        // if (url.pathname === "/api/items") {
        //     console.log("Handling /api/items request");
        //     if (request.method === "GET") {
        //         try {
        //             const allItems = await db.select().from(items);
        //             return Response.json(allItems);
        //         } catch (error) {
        //             return Response.json({ error: "Failed to fetch items" }, { status: 500 });
        //         }
        //     }
        //
        //     if (request.method === "POST") {
        //
        //         console.log("Handling /api/items POST request");
        //         try {
        //             const body = await request.json() as { name: string; description?: string };
        //
        //             if (!body.name) {
        //                 return Response.json({ error: "Name is required" }, { status: 400 });
        //             }
        //
        //             const newItem = {
        //                 name: body.name,
        //             };
        //
        //             console.log("Inserting new item:", newItem);
        //             const result = await db.insert(items).values(newItem).returning();
        //             return Response.json(result[0], { status: 201 });
        //         } catch (error) {
        //             console.error(error);
        //             return Response.json({ error: "Failed to create item" }, { status: 500 });
        //         }
        //     }
        // }
        //
        // if (url.pathname.startsWith("/api/")) {
        //     return Response.json({
        //         name: "Cloudflare",
        //     });
        // }

        return new Response(null, { status: 404 });
    },
};
