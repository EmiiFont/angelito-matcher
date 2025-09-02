// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db/client";
import { user, session, account, verification } from "../db/schema";

export function createAuth(db: ReturnType<typeof createDB>, env: any) {
    const isProd = env.ENVIRONMENT === "production";
    const apiBaseURL = isProd
        ? "https://myangelito.com"
        : (env.API_ORIGIN ?? "http://localhost:8787");

    const frontendOrigin = isProd
        ? "https://myangelito.com"
        : (env.FRONTEND_ORIGIN ?? "http://localhost:5173");

    const sameOrigin = apiBaseURL === frontendOrigin;

    const defaultCookieAttributes = sameOrigin
        ? { httpOnly: true, secure: isProd, sameSite: "lax" as const, path: "/" }
        : { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" }; // requires HTTPS on both

    const config: any = {
        baseURL: apiBaseURL,
        basePath: "/api/auth",
        secret: env.BETTER_AUTH_SECRET,
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: { user, session, account, verification },
        }),
        emailAndPassword: { enabled: true },
        session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
        advanced: { defaultCookieAttributes },
        logger: { level: "debug", disabled: false },
        trustedOrigins: [
            frontendOrigin,
            "https://appleid.apple.com",
            "https://accounts.google.com",
            "https://myangelito.com",  // Always include production domain
            apiBaseURL !== frontendOrigin ? apiBaseURL : null
        ].filter(Boolean),
    };

    const socialProviders: any = {};
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
        socialProviders.google = { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
    }
    if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
        socialProviders.apple = { clientId: env.APPLE_CLIENT_ID, clientSecret: env.APPLE_CLIENT_SECRET };
    }
    if (Object.keys(socialProviders).length) config.socialProviders = socialProviders;

    return betterAuth(config);
}

