// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db/client";
import { user, session, account, verification } from "../db/schema";

interface AuthEnv {
    NODE_ENV?: string;
    API_ORIGIN?: string;
    FRONTEND_ORIGIN?: string;
    BETTER_AUTH_SECRET: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    APPLE_CLIENT_ID?: string;
    APPLE_CLIENT_SECRET?: string;
    [key: string]: unknown;
}

export function createAuth(db: ReturnType<typeof createDB>, env: AuthEnv) {
    const isProd = env.NODE_ENV === "production";
    
    const frontendOrigin = isProd
        ? "https://myangelito.com"
        : (env.FRONTEND_ORIGIN ?? "http://localhost:5173");

    // const sameOrigin = apiBaseURL === frontendOrigin;

    // const defaultCookieAttributes = sameOrigin
    //     ? { httpOnly: true, secure: isProd, sameSite: "lax" as const, path: "/" }
    //     : { httpOnly: true, secure: false, sameSite: "none" as const, path: "/" }; // requires HTTPS on both

    const config: {
        secret: string;
        database: unknown;
        logger: {
            disabled: boolean;
            level: "info";
            log: (level: string, message: string, ...args: unknown[]) => void;
        };
        emailAndPassword: { enabled: boolean };
        trustedOrigins: string[];
        socialProviders?: Record<string, unknown>;
    } = {
        secret: env.BETTER_AUTH_SECRET,
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: { user, session, account, verification },
        }),
        logger: {
            disabled: false,
            level: "info" as const,
            log: (level: string, message: string, ...args: unknown[]) => {
                // Custom logging implementation
                console.log(`[${level}] ${message}`, ...args);
            }
        },
        emailAndPassword: { enabled: true },
        trustedOrigins: [
            frontendOrigin,
            "https://appleid.apple.com",
            "https://accounts.google.com",
            "https://myangelito.com",  // Always include production domain
            "http://localhost:5173",   // Always include localhost for development
        ].filter(Boolean),
    };

    const socialProviders: Record<string, unknown> = {};
    console.log("activating google")
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
        socialProviders.google = {
            clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET,
        };
    }
    if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
        socialProviders.apple = { clientId: env.APPLE_CLIENT_ID, clientSecret: env.APPLE_CLIENT_SECRET };
    }
    if (Object.keys(socialProviders).length) config.socialProviders = socialProviders;

    return betterAuth(config);
}

