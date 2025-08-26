import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from 'drizzle-orm/d1';
import { user, session, account, verification } from "../../worker/db/schema";
import type { D1Database } from '@cloudflare/workers-types';

export function createAuth(database: D1Database) {
    const db = drizzle(database, { schema: { user, session, account, verification } });

    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: {
                user,
                session,
                account,
                verification
            },
        }),
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
        },
        socialProviders: {
            // We can add social providers later if needed
        },
        secret: process.env.AUTH_SECRET || "your-secret-key-change-this-in-production",
        baseURL: process.env.BASE_URL || "https://your-domain.com",
        trustedOrigins: ["https://your-domain.com", "http://localhost:3001"],
    });
}