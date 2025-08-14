import { EventsAPI } from './events';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export class RegistrationAPI {
    private eventsAPI: EventsAPI;

    constructor(private db: DrizzleD1Database) {
        this.eventsAPI = new EventsAPI(db);
    }

    async handleRequest(request: Request, pathname: string): Promise<Response> {
        const method = request.method;
        const pathParts = pathname.split('/');

        // Handle /api/register/:linkId (GET - get registration form details)
        if (pathParts.length === 4 && pathParts[2] === 'register' && method === 'GET') {
            const linkId = pathParts[3];
            
            try {
                const registrationDetails = await this.eventsAPI.getRegistrationLink(linkId);
                if (!registrationDetails) {
                    return Response.json({ error: 'Invalid or expired registration link' }, { status: 404 });
                }

                return Response.json({
                    eventName: registrationDetails.eventName,
                    organizerName: registrationDetails.organizerName,
                    notificationChannels: registrationDetails.notificationChannels,
                    linkId: registrationDetails.linkId
                });
            } catch (error) {
                return Response.json(
                    { error: error instanceof Error ? error.message : 'Failed to get registration details' },
                    { status: 500 }
                );
            }
        }

        // Handle /api/register/:linkId (POST - submit registration)
        if (pathParts.length === 4 && pathParts[2] === 'register' && method === 'POST') {
            const linkId = pathParts[3];
            
            try {
                const body = await request.json() as { name: string; email: string; phone?: string };
                
                if (!body.name || !body.email) {
                    return Response.json(
                        { error: 'Name and email are required' },
                        { status: 400 }
                    );
                }

                const result = await this.eventsAPI.registerParticipant(linkId, body);
                
                if (!result.success) {
                    return Response.json({ error: result.message }, { status: 400 });
                }

                return Response.json({ message: result.message }, { status: 201 });
            } catch (error) {
                return Response.json(
                    { error: error instanceof Error ? error.message : 'Failed to register participant' },
                    { status: 500 }
                );
            }
        }

        return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }
}