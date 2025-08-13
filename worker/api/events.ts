import { eq, and } from 'drizzle-orm';
import { events, participants, userParticipants, eventParticipantMatches, participantRestrictions, participantMatchViews } from '../db/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { Matching } from '../lib/matching';

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export interface ParticipantWithRestrictions {
    name: string;
    email: string;
    phoneNumber: string;
    restrictions?: string[]; // emails of participants they can't be matched with
}

export interface CreateEventRequest {
    name: string;
    date: string | Date;
    budget: number;
    location: string;
    participants: ParticipantWithRestrictions[];
    userId?: string; // optional user ID to associate participants
}

export class EventsAPI {
    constructor(private db: DrizzleD1Database) { }

    async getAll(userId?: string): Promise<Event[]> {
        try {
            if (!userId) {
                // If no userId provided, return all events (admin behavior)
                throw new Error('unauthorized');
            }

            const userEvents = await this.db
                .selectDistinct({
                    id: events.id,
                    name: events.name,
                    date: events.date,
                    numberOfParticipants: events.numberOfParticipants,
                    budget: events.budget,
                    location: events.location,
                    endedAt: events.endedAt,
                    createdAt: events.createdAt,
                    updatedAt: events.updatedAt,
                })
                .from(events)
                .innerJoin(participants, eq(participants.eventId, events.id))
                .innerJoin(userParticipants, eq(userParticipants.participantId, participants.id))
                .where(eq(userParticipants.userId, userId));

            return userEvents;
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

    async getEventDetails(id: string) {
        try {
            // Get event details
            const event = await this.getById(id);
            if (!event) {
                return null;
            }

            // Get participants for this event
            const eventParticipants = await this.db
                .select()
                .from(participants)
                .where(eq(participants.eventId, id));

            // Get matches for this event
            const matches = await this.db
                .select({
                    id: eventParticipantMatches.id,
                    participantId: eventParticipantMatches.participantId,
                    matchedWithParticipantId: eventParticipantMatches.matchedWithParticipantId,
                    createdAt: eventParticipantMatches.createdAt,
                    participant: {
                        id: participants.id,
                        name: participants.name,
                        email: participants.email,
                        phoneNumber: participants.phoneNumber,
                    }
                })
                .from(eventParticipantMatches)
                .innerJoin(participants, eq(eventParticipantMatches.participantId, participants.id))
                .where(eq(eventParticipantMatches.eventId, id));

            // Get match views for this event
            const matchViews = await this.db
                .select()
                .from(participantMatchViews)
                .where(eq(participantMatchViews.eventId, id));

            // Create a map of who has viewed their matches
            const viewedMap = new Map<string, boolean>();
            matchViews.forEach(view => {
                viewedMap.set(view.participantId, true);
            });

            // Enhance participants with match info and view status
            const participantsWithMatches = eventParticipants.map(participant => {
                const match = matches.find(m => m.participantId === participant.id);
                const matchedParticipant = match ?
                    eventParticipants.find(p => p.id === match.matchedWithParticipantId) : null;

                return {
                    ...participant,
                    hasViewedMatch: viewedMap.get(participant.id) || false,
                    match: matchedParticipant ? {
                        id: matchedParticipant.id,
                        name: matchedParticipant.name,
                        email: matchedParticipant.email,
                        phoneNumber: matchedParticipant.phoneNumber,
                    } : null
                };
            });

            return {
                event,
                participants: participantsWithMatches,
                totalMatches: matches.length,
                totalViewed: matchViews.length
            };
        } catch (error) {
            console.error(`Failed to fetch event details ${id}:`, error);
            throw new Error('Failed to fetch event details');
        }
    }

    async create(eventData: CreateEventRequest): Promise<Event> {
        try {
            console.log('Creating event with data:', eventData);

            // Use database transaction to ensure atomicity
            return await this.db.transaction(async (tx) => {
                const eventId = crypto.randomUUID();
                const now = new Date();

                // Create the event
                const newEvent: typeof events.$inferInsert = {
                    id: eventId,
                    name: eventData.name,
                    date: new Date(eventData.date),
                    numberOfParticipants: eventData.participants.length,
                    budget: eventData.budget,
                    location: eventData.location,
                    createdAt: now,
                    updatedAt: now,
                };

                const [createdEvent] = await tx
                    .insert(events)
                    .values(newEvent)
                    .returning();

                // Handle participants - create new ones
                const participantMap = new Map<string, string>(); // email -> participantId
                const participantInserts: typeof participants.$inferInsert[] = [];

                for (const participant of eventData.participants) {
                    const participantId = crypto.randomUUID();
                    participantMap.set(participant.email, participantId);

                    participantInserts.push({
                        id: participantId,
                        eventId: eventId,
                        name: participant.name,
                        email: participant.email,
                        phoneNumber: participant.phoneNumber,
                        createdAt: now,
                        updatedAt: now,
                    });
                }

                // Insert all participants in batch
                if (participantInserts.length > 0) {
                    await tx.insert(participants).values(participantInserts);
                }

                // Insert user-participant associations if userId provided
                if (eventData.userId) {
                    const userParticipantInserts: typeof userParticipants.$inferInsert[] = [];

                    for (const [email, participantId] of participantMap) {
                        // Check if this user-participant association already exists
                        const existingAssociation = await tx
                            .select()
                            .from(userParticipants)
                            .where(and(
                                eq(userParticipants.userId, eventData.userId),
                                eq(userParticipants.participantId, participantId)
                            ))
                            .limit(1);

                        if (existingAssociation.length === 0) {
                            // Only insert if association doesn't exist
                            userParticipantInserts.push({
                                id: crypto.randomUUID(),
                                userId: eventData.userId,
                                participantId: participantId,
                                createdAt: now,
                            });
                        }
                    }

                    // Insert all user-participant associations in batch
                    if (userParticipantInserts.length > 0) {
                        await tx.insert(userParticipants).values(userParticipantInserts);
                    }
                }

                // Build restrictions map for matching algorithm and prepare restriction inserts
                const restrictionsMap: Record<string, string[]> = {};
                const restrictionInserts: typeof participantRestrictions.$inferInsert[] = [];

                for (const participant of eventData.participants) {
                    if (participant.restrictions && participant.restrictions.length > 0) {
                        // Filter out invalid restriction emails (only include emails of actual participants)
                        const validRestrictions = participant.restrictions.filter(email =>
                            participantMap.has(email)
                        );

                        if (validRestrictions.length > 0) {
                            restrictionsMap[participant.email] = validRestrictions;

                            // Prepare restrictions for database insertion
                            for (const restrictedEmail of validRestrictions) {
                                restrictionInserts.push({
                                    id: crypto.randomUUID(),
                                    eventId: eventId,
                                    participantId: participantMap.get(participant.email)!,
                                    restrictedParticipantId: participantMap.get(restrictedEmail)!,
                                });
                            }
                        }
                    }
                }

                // Insert all restrictions in batch
                if (restrictionInserts.length > 0) {
                    await tx.insert(participantRestrictions).values(restrictionInserts);
                }

                // Generate matches using the matching algorithm
                const participantEmails = eventData.participants.map(p => p.email);
                const matches = Matching.matchParticipants(participantEmails, restrictionsMap);

                console.log('Generated matches:', matches);

                // Prepare and insert matches into database
                if (matches.length > 0) {
                    const matchInserts: typeof eventParticipantMatches.$inferInsert[] = [];

                    for (const [giverEmail, receiverEmail] of matches) {
                        const giverId = participantMap.get(giverEmail);
                        const receiverId = participantMap.get(receiverEmail);

                        if (giverId && receiverId) {
                            matchInserts.push({
                                id: crypto.randomUUID(),
                                eventId: eventId,
                                participantId: giverId,
                                matchedWithParticipantId: receiverId,
                                createdAt: now,
                            });
                        }
                    }

                    // Insert all matches in batch
                    await tx.insert(eventParticipantMatches).values(matchInserts);
                }

                console.log(`Event created successfully with ${matches.length} matches`);
                return createdEvent;
            });
        } catch (error) {
            console.error('Failed to create event:', error);
            // Transaction will automatically rollback on error
            throw new Error('Failed to create event: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

    async handleRequest(request: Request, pathname: string, userId?: string): Promise<Response> {
        const method = request.method;
        const pathParts = pathname.split('/');

        // Handle /api/events
        if (pathParts.length === 3) {
            if (method === 'GET') {
                try {
                    const allEvents = await this.getAll(userId);
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
                    const body = await request.json() as CreateEventRequest;

                    // Validate required fields
                    if (!body.name || !body.date || !body.budget || !body.location || !body.participants) {
                        return Response.json(
                            { error: 'Missing required fields: name, date, budget, location, participants' },
                            { status: 400 }
                        );
                    }

                    // Validate participants
                    if (!Array.isArray(body.participants) || body.participants.length < 2) {
                        return Response.json(
                            { error: 'At least 2 participants are required' },
                            { status: 400 }
                        );
                    }

                    // Validate each participant
                    for (const participant of body.participants) {
                        if (!participant.name || !participant.email || !participant.phoneNumber) {
                            return Response.json(
                                { error: 'Each participant must have name, email, and phoneNumber' },
                                { status: 400 }
                            );
                        }
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

        // Handle /api/events/:id/details
        if (pathParts.length === 5 && pathParts[4] === 'details') {
            const eventId = pathParts[3];

            if (method === 'GET') {
                try {
                    const eventDetails = await this.getEventDetails(eventId);
                    if (!eventDetails) {
                        return Response.json({ error: 'Event not found' }, { status: 404 });
                    }
                    return Response.json(eventDetails);
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to fetch event details' },
                        { status: 500 }
                    );
                }
            }
        }

        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
}
