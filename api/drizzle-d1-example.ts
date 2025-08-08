/**
 * Example Cloudflare Worker endpoint using Drizzle ORM with a D1 database.
 *
 * Bind your D1 database as `DB` in your wrangler.toml or Pages project.
 * Provides sample GET and POST handlers interacting with a `users` table.
 */
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import type { D1Database } from '@cloudflare/workers-types';

// Define the bindings available to this worker
interface Bindings {
  DB: D1Database;
}

// Create a Hono app typed with the D1 binding
const app = new Hono<{ Bindings: Bindings }>();

// Define a simple table schema
const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
});

// Fetch all users from the D1 database
app.get('/users', async (c) => {
  const db = drizzle(c.env.DB);
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

// Insert a new user into the D1 database
app.post('/users', async (c) => {
  const db = drizzle(c.env.DB);
  const { name } = await c.req.json();
  await db.insert(users).values({ name });
  return c.text('ok');
});

export default app;
