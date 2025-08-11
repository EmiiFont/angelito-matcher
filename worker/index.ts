import { createDB } from './db/client';
import { items } from './db/schema';

export default {
    async fetch(request: Request, env: any) {
        const url = new URL(request.url);
        const db = createDB(env.DB);

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
