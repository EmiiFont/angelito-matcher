import { Hono } from 'hono'
import { renderer } from './renderer'
import { drizzle } from 'drizzle-orm/d1';
import { items } from './schema';

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/api/items', async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(items).all();
  return c.json(result)
})

app.post('/api/items', async (c) => {
  const { name } = await c.req.json<{ name: string }>();
  const db = drizzle(c.env.DB);
  const result = await db.insert(items).values({ name }).returning();
  return c.json(result)
})

export default app