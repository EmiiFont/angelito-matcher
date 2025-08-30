import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db/client";
import { user, session, account, verification } from "../db/schema";

export function createAuth(db: ReturnType<typeof createDB>, env: any) {
    // Check for required environment variables
    const googleClientId = env.GOOGLE_CLIENT_ID;
    const googleClientSecret = env.GOOGLE_CLIENT_SECRET;

    const config: any = {
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: {
                user,
                session,
                account,
                verification,
            },
        }),
        emailAndPassword: {
            enabled: true,
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
            cookieCache: {
                enabled: true,
                maxAge: 60 * 5, // 5 minutes
            },
        },
        trustedOrigins: ["http://localhost:5173", "https://myangelito.com", "https://appleid.apple.com"]
    };

    config.socialProviders = {
        google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        },
         apple: { 
            clientId: process.env.APPLE_CLIENT_ID as string, 
            clientSecret: process.env.APPLE_CLIENT_SECRET as string, 
        }, 
    };

    return betterAuth(config);
}
