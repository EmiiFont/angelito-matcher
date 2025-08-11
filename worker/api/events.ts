import { eq } from 'drizzle-orm';
import { events } from '../db/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export class EventsAPI {
    constructor(private db: DrizzleD1Database) { }

    async getAll(): Promise<Event[]> {
        try {
            return await this.db.select().from(events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            throw new Error('Failed to fetch events');
        }
    }

    async getById(id: string): Promise<Event | null> {
        try {
            const result = await this.db
                .select()
                .from(events)
                .where(eq(events.id, id))
                .limit(1);

            return result[0] || null;
        } catch (error) {
            console.error(`Failed to fetch event ${id}:`, error);
            throw new Error('Failed to fetch event');
        }
    }

    async create(eventData: Omit<NewEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
        try {
            console.log('Creating event with data:', eventData);
            const newEvent: NewEvent = {
                id: crypto.randomUUID(),
                ...eventData,
                date: new Date(eventData.date),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await this.db
                .insert(events)
                .values(newEvent)
                .returning();

            return result[0];
        } catch (error) {
            console.error('Failed to create event:', error);
            throw new Error('Failed to create event');
        }
    }

    async update(id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt'>>): Promise<Event | null> {
        try {
            const updateData = {
                ...eventData,
                updatedAt: new Date(),
            };

            const result = await this.db
                .update(events)
                .set(updateData)
                .where(eq(events.id, id))
                .returning();

            return result[0] || null;
        } catch (error) {
            console.error(`Failed to update event ${id}:`, error);
            throw new Error('Failed to update event');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.db
                .delete(events)
                .where(eq(events.id, id))
                .returning();

            return result.length > 0;
        } catch (error) {
            console.error(`Failed to delete event ${id}:`, error);
            throw new Error('Failed to delete event');
        }
    }

    async handleRequest(request: Request, pathname: string): Promise<Response> {
        const method = request.method;
        const pathParts = pathname.split('/');

        // Handle /api/events
        if (pathParts.length === 3) {
            if (method === 'GET') {
                try {
                    const allEvents = await this.getAll();
                    return Response.json(allEvents);
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to fetch events' },
                        { status: 500 }
                    );
                }
            }

            if (method === 'POST') {
                try {
                    const body = await request.json() as Omit<NewEvent, 'id' | 'createdAt' | 'updatedAt'>;

                    // Validate required fields
                    if (!body.name || !body.date || !body.numberOfParticipants || !body.budget || !body.location) {
                        return Response.json(
                            { error: 'Missing required fields: name, date, numberOfParticipants, budget, location' },
                            { status: 400 }
                        );
                    }

                    const newEvent = await this.create(body);
                    return Response.json(newEvent, { status: 201 });
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to create event' },
                        { status: 500 }
                    );
                }
            }
        }

        // Handle /api/events/:id
        if (pathParts.length === 4) {
            const eventId = pathParts[3];

            if (method === 'GET') {
                try {
                    const event = await this.getById(eventId);
                    if (!event) {
                        return Response.json({ error: 'Event not found' }, { status: 404 });
                    }
                    return Response.json(event);
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to fetch event' },
                        { status: 500 }
                    );
                }
            }

            if (method === 'PUT') {
                try {
                    const body = await request.json() as Partial<Omit<Event, 'id' | 'createdAt'>>;
                    const updatedEvent = await this.update(eventId, body);

                    if (!updatedEvent) {
                        return Response.json({ error: 'Event not found' }, { status: 404 });
                    }

                    return Response.json(updatedEvent);
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to update event' },
                        { status: 500 }
                    );
                }
            }

            if (method === 'DELETE') {
                try {
                    const deleted = await this.delete(eventId);

                    if (!deleted) {
                        return Response.json({ error: 'Event not found' }, { status: 404 });
                    }

                    return Response.json({ message: 'Event deleted successfully' });
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to delete event' },
                        { status: 500 }
                    );
                }
            }
        }

        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
}
