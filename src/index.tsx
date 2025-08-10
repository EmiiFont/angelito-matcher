import { Hono } from 'hono'
import { renderer } from './renderer'
import { drizzle } from 'drizzle-orm/d1';
import { items } from './schema';
import { HomePage } from './components/SSRHomePage';
import { Dashboard } from './components/SSRDashboard';
import { AuthPage } from './components/SSRAuth';
import { GetStarted } from './components/SSRGetStarted';

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.use(renderer)

// Add client-side navigation script
const navigationScript = `
  window.navigateTo = function(page) {
    window.location.href = '/' + page;
  };
  
  window.handleGetStarted = function() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/get-started';
    }
  };
  
  window.handleLogin = function() {
    localStorage.setItem('isAuthenticated', 'true');
    window.location.href = '/dashboard';
  };
  
  window.handleLogout = function() {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };
`;

// Routes for each page
app.get('/', (c) => {
  return c.render(
    <div>
      <HomePage />
      <script dangerouslySetInnerHTML={{ __html: navigationScript }} />
    </div>
  )
})

app.get('/dashboard', (c) => {
  return c.render(
    <div>
      <Dashboard />
      <script dangerouslySetInnerHTML={{ __html: navigationScript }} />
    </div>
  )
})

app.get('/auth', (c) => {
  return c.render(
    <div>
      <AuthPage />
      <script dangerouslySetInnerHTML={{ __html: navigationScript }} />
    </div>
  )
})

app.get('/get-started', (c) => {
  return c.render(
    <div>
      <GetStarted />
      <script dangerouslySetInnerHTML={{ __html: navigationScript }} />
    </div>
  )
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
