import { eq } from 'drizzle-orm';
import { participants, userParticipants, eventParticipantMatches, participantRestrictions, type Participant, type NewParticipant, type NewUserParticipant } from '../db/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

type Database = DrizzleD1Database<typeof schema>;

export class ParticipantsAPI {
    private db: Database;
    
    constructor(db: Database) {
        this.db = db;
    }

    async create(participantData: Omit<NewParticipant, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Participant> {
        try {
            const participantId = crypto.randomUUID();

            const newParticipant: NewParticipant = {
                id: participantId,
                ...participantData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Insert participant first
            const participantResult = await this.db
                .insert(participants)
                .values(newParticipant)
                .returning();

            // Create user-participant relationship
            const userParticipantRelation: NewUserParticipant = {
                id: crypto.randomUUID(),
                userId: userId,
                participantId: participantId,
                createdAt: new Date(),
            };

            await this.db
                .insert(userParticipants)
                .values(userParticipantRelation);

            return participantResult[0];
        } catch (error) {
            console.error('Failed to create participant:', error);
            throw new Error('Failed to create participant');
        }
    }

    async delete(participantId: string, userId?: string): Promise<boolean> {
        try {
            // If userId is provided, only delete if the participant belongs to this user
            if (userId) {
                const userParticipant = await this.db
                    .select()
                    .from(userParticipants)
                    .where(
                        eq(userParticipants.participantId, participantId)
                    )
                    .limit(1);

                if (userParticipant.length === 0 || userParticipant[0].userId !== userId) {
                    return false; // Participant not found or doesn't belong to user
                }
            }

            // Delete participant (cascade will handle userParticipants relationship)
            const result = await this.db
                .delete(participants)
                .where(eq(participants.id, participantId))
                .returning();

            return result.length > 0;
        } catch (error) {
            console.error(`Failed to delete participant ${participantId}:`, error);
            throw new Error('Failed to delete participant');
        }
    }

    async getByEventId(eventId: string): Promise<Participant[]> {
        try {
            // Get participants from event matches
            const matchParticipants = await this.db
                .select({
                    id: participants.id,
                    eventId: participants.eventId,
                    name: participants.name,
                    email: participants.email,
                    phoneNumber: participants.phoneNumber,
                    createdAt: participants.createdAt,
                    updatedAt: participants.updatedAt,
                })
                .from(participants)
                .innerJoin(eventParticipantMatches, eq(participants.id, eventParticipantMatches.participantId))
                .where(eq(eventParticipantMatches.eventId, eventId));

            // Get participants from restrictions
            const restrictionParticipants = await this.db
                .select({
                    id: participants.id,
                    eventId: participants.eventId,
                    name: participants.name,
                    email: participants.email,
                    phoneNumber: participants.phoneNumber,
                    createdAt: participants.createdAt,
                    updatedAt: participants.updatedAt,
                })
                .from(participants)
                .innerJoin(participantRestrictions, eq(participants.id, participantRestrictions.participantId))
                .where(eq(participantRestrictions.eventId, eventId));

            // Get participants from matched_with restrictions
            const matchedRestrictionParticipants = await this.db
                .select({
                    id: participants.id,
                    eventId: participants.eventId,
                    name: participants.name,
                    email: participants.email,
                    phoneNumber: participants.phoneNumber,
                    createdAt: participants.createdAt,
                    updatedAt: participants.updatedAt,
                })
                .from(participants)
                .innerJoin(participantRestrictions, eq(participants.id, participantRestrictions.restrictedParticipantId))
                .where(eq(participantRestrictions.eventId, eventId));

            // Combine and deduplicate participants
            const allParticipants = [
                ...matchParticipants,
                ...restrictionParticipants,
                ...matchedRestrictionParticipants
            ];

            // Remove duplicates based on participant id
            const uniqueParticipants = allParticipants.reduce((unique, participant) => {
                if (!unique.find(p => p.id === participant.id)) {
                    unique.push(participant);
                }
                return unique;
            }, [] as Participant[]);

            return uniqueParticipants;
        } catch (error) {
            console.error(`Failed to fetch participants for event ${eventId}:`, error);
            throw new Error('Failed to fetch participants by event');
        }
    }

    async getByUserId(userId: string): Promise<Participant[]> {
        try {
            const result = await this.db
                .select({
                    id: participants.id,
                    eventId: participants.eventId,
                    name: participants.name,
                    email: participants.email,
                    phoneNumber: participants.phoneNumber,
                    createdAt: participants.createdAt,
                    updatedAt: participants.updatedAt,
                })
                .from(participants)
                .innerJoin(userParticipants, eq(participants.id, userParticipants.participantId))
                .where(eq(userParticipants.userId, userId));

            return result;
        } catch (error) {
            console.error(`Failed to fetch participants for user ${userId}:`, error);
            throw new Error('Failed to fetch participants by user');
        }
    }

    async handleRequest(request: Request, pathname: string, userId?: string): Promise<Response> {
        const method = request.method;
        const pathParts = pathname.split('/');

        // Handle /api/participants
        if (pathParts.length === 3) {
            if (method === 'POST') {
                if (!userId) {
                    return Response.json({ error: 'Authentication required' }, { status: 401 });
                }

                try {
                    const body = await request.json() as Omit<NewParticipant, 'id' | 'createdAt' | 'updatedAt'>;

                    // Validate required fields
                    if (!body.name || !body.email || !body.phoneNumber) {
                        return Response.json(
                            { error: 'Missing required fields: name, email, phoneNumber' },
                            { status: 400 }
                        );
                    }

                    const newParticipant = await this.create(body, userId);
                    return Response.json(newParticipant, { status: 201 });
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to create participant' },
                        { status: 500 }
                    );
                }
            }
        }

        // Handle /api/participants/:id
        if (pathParts.length === 4) {
            const participantId = pathParts[3];

            if (method === 'DELETE') {
                try {
                    const deleted = await this.delete(participantId, userId);

                    if (!deleted) {
                        return Response.json({ error: 'Participant not found or access denied' }, { status: 404 });
                    }

                    return Response.json({ message: 'Participant deleted successfully' });
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to delete participant' },
                        { status: 500 }
                    );
                }
            }
        }

        // Handle /api/participants/event/:eventId
        if (pathParts.length === 5 && pathParts[3] === 'event') {
            const eventId = pathParts[4];

            if (method === 'GET') {
                try {
                    const participants = await this.getByEventId(eventId);
                    return Response.json(participants);
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to fetch participants' },
                        { status: 500 }
                    );
                }
            }
        }

        // Handle /api/participants/user/:userId or /api/participants/user (for current user)
        if (pathParts.length >= 4 && pathParts[3] === 'user') {
            const targetUserId = pathParts.length === 5 ? pathParts[4] : userId;

            if (!targetUserId) {
                return Response.json({ error: 'User ID required' }, { status: 400 });
            }

            if (method === 'GET') {
                try {
                    const participants = await this.getByUserId(targetUserId);
                    return Response.json(participants);
                } catch (error) {
                    return Response.json(
                        { error: error instanceof Error ? error.message : 'Failed to fetch participants' },
                        { status: 500 }
                    );
                }
            }
        }

        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
}
