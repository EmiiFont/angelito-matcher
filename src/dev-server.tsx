import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import api from '@/api';
import path from 'path';
import { watch } from 'fs';
import { build } from 'bun';

const app = new Hono();

// Enable CORS for all routes
app.use('/*', cors());

// Serve static files from dist directory
app.use('/*', serveStatic({
  root: './dist',
  rewriteRequestPath: (path) => path.replace(/^\//, '')
}));

// Mount API routes
app.route('/api', api);

// SPA fallback - serve index.html for all non-API routes
app.get('*', async (c) => {
  const url = new URL(c.req.url);
  
  // Don't serve HTML for API routes
  if (url.pathname.startsWith('/api/')) {
    return c.text('Not Found', 404);
  }

  try {
    // Serve index.html from dist directory
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    const file = Bun.file(indexPath);
    const content = await file.text();
    return c.html(content);
  } catch (error) {
    return c.text('Could not load app', 500);
  }
});

// Build function
async function buildApp() {
  console.log('🔨 Building app...');
  try {
    const proc = Bun.spawn(['bun', 'run', 'build.ts'], {
      stdio: ['inherit', 'inherit', 'inherit'],
    });
    await proc.exited;
    console.log('✅ Build completed');
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

// Watch for file changes
let isBuilding = false;
const srcWatcher = watch('./src', { recursive: true }, async (eventType, filename) => {
  if (isBuilding || !filename) return;
  
  // Only rebuild for relevant file types
  if (filename.match(/\.(tsx?|css|html)$/)) {
    console.log(`📁 File changed: ${filename}`);
    isBuilding = true;
    await buildApp();
    isBuilding = false;
  }
});

const stylesWatcher = watch('./styles', { recursive: true }, async (eventType, filename) => {
  if (isBuilding || !filename) return;
  
  if (filename.match(/\.css$/)) {
    console.log(`🎨 Style changed: ${filename}`);
    isBuilding = true;
    await buildApp();
    isBuilding = false;
  }
});

// Initial build
await buildApp();

const port = 3001;
console.log(`🚀 Development server running at http://localhost:${port}`);
console.log(`👀 Watching for changes...`);

serve({
  fetch: app.fetch,
  port,
});