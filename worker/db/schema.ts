import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});


export const participants = sqliteTable("participants", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const events = sqliteTable("events", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    numberOfParticipants: integer("number_of_participants").notNull(),
    budget: integer("budget").notNull(),
    location: text("location").notNull(),
    endedAt: integer("ended_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const eventDeliveryMethods = sqliteTable(
    "event_delivery_methods",
    {
        id: text("id").primaryKey(),
        eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
        deliveryMethod: text("delivery_method", { enum: ["email", "sms", "whatsapp"] }).notNull(),
    },
    (t) => ({
        uniqEvent: uniqueIndex("uniq_event_delivery_method").on(t.eventId, t.deliveryMethod),
    })
);

export const participantRestrictions = sqliteTable(
    "participant_restrictions",
    {
        id: text("id").primaryKey(),
        eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
        participantId: text("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
        restrictedParticipantId: text("restricted_participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
    },
    (t) => ({
        // prevent duplicates (A cannot be restricted from B twice within same event)
        uniqRestriction: uniqueIndex("uniq_event_participant_restricted")
            .on(t.eventId, t.participantId, t.restrictedParticipantId),
    })
);

export const eventParticipantMatches = sqliteTable(
    "event_participant_matches",
    {
        id: text("id").primaryKey(),
        eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
        participantId: text("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
        matchedWithParticipantId: text("matched_with_participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
        createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    },
    (t) => ({
        // avoid duplicate pairs within an event
        uniqMatch: uniqueIndex("uniq_event_pair")
            .on(t.eventId, t.participantId, t.matchedWithParticipantId),
    })
);

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" })
        .$defaultFn(() => !1)
        .notNull(),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .$defaultFn(() => new Date())
        .notNull(),
});

export const userParticipants = sqliteTable(
    "user_participants",
    {
        id: text("id").primaryKey(),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        participantId: text("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
        createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
    },
    (t) => ({
        // prevent a user from adding the same participant twice
        uniqUserParticipant: uniqueIndex("uniq_user_participant").on(t.userId, t.participantId),
    })
);

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
        mode: "timestamp",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
        mode: "timestamp",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
        () => new Date(),
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
        () => new Date(),
    ),
});

export const eventRelations = relations(events, ({ many }) => ({
    deliveryMethods: many(eventDeliveryMethods),
    matches: many(eventParticipantMatches),
    restrictions: many(participantRestrictions),
}));

export const participantRelations = relations(participants, ({ many }) => ({
    restrictions: many(participantRestrictions),
    matches: many(eventParticipantMatches),
    userParticipants: many(userParticipants),
}));

export const userRelations = relations(user, ({ many }) => ({
    userParticipants: many(userParticipants),
}));

export const userParticipantRelations = relations(userParticipants, ({ one }) => ({
    user: one(user, {
        fields: [userParticipants.userId],
        references: [user.id],
    }),
    participant: one(participants, {
        fields: [userParticipants.participantId],
        references: [participants.id],
    }),
}));

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;

export type UserParticipant = typeof userParticipants.$inferSelect;
export type NewUserParticipant = typeof userParticipants.$inferInsert;
