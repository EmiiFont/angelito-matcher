import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db/client";
import { user, session, account, verification } from "../db/schema";

export function createAuth(db: ReturnType<typeof createDB>, env: any) {
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
        },
        advanced: {
            defaultCookieAttributes: {
                httpOnly: true,
                secure: true,
                sameSite: "lax" as const,
                path: "/",
            },
        },
        logger: {
            level: "debug",
            disabled: false
        },
        trustedOrigins: ["http://localhost:5173", "https://myangelito.com", "https://appleid.apple.com"],
        baseURL: "https://myangelito.com",
        secret: env.BETTER_AUTH_SECRET,
    };

    // Add social providers only if environment variables are available
    const socialProviders: any = {};

    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
        socialProviders.google = {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        };
    }

    if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
        socialProviders.apple = {
            clientId: env.APPLE_CLIENT_ID,
            clientSecret: env.APPLE_CLIENT_SECRET,
        };
    }

    if (Object.keys(socialProviders).length > 0) {
        config.socialProviders = socialProviders;
    }

    return betterAuth(config);
}
