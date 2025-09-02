import { createDB } from './db/client';
import { items } from './db/schema';
import { createAuth } from './lib/auth';
import { EventsAPI } from './api/events';
import { ParticipantsAPI } from './api/participants';
import { RegistrationAPI } from './api/registration';
import { createEmailService } from './lib/email';
import { createMessagingService } from './lib/messaging';

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

        if (url.pathname.startsWith("/api/auth")) {
            console.log("Auth request URL:", url.pathname);
            console.log("Auth request:", JSON.stringify(request));
            // Preflight/health
            if (request.method === "OPTIONS" || request.method === "HEAD") {
                return new Response(null, {
                    status: 204,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,HEAD",
                        "Access-Control-Allow-Headers": "Content-Type,Authorization",
                    },
                });
            }

            // Clone the request to read the body without consuming it
            const clonedRequest = request.clone();
            try {
                const body = await clonedRequest.text();
                console.log("Auth request body:", body);
            } catch (e) {
                console.log("Could not read body:", e);
            }

            try {
                const result = await auth.handler(request);
                console.log("Auth handler result:", result);

                return result
            } catch (error) {
                console.log("Auth error:", error)
                return Response.json({ error: "Authentication error" }, { status: 500 });
            }

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
