import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            async function fetchItems() {
              const res = await fetch('/api/items');
              const items = await res.json();
              const list = document.getElementById('items-list');
              if (list) {
                list.innerHTML = items.map(item => \`
                  <li style="
                    padding: 12px 16px;
                    margin: 8px 0;
                    background: #f8f9fa;
                    border-radius: 6px;
                    border-left: 4px solid #667eea;
                    font-size: 16px;
                    color: #333;
                  ">\${item.name}</li>
                \`).join('');
              }
            }

            document.getElementById('add-item-form')?.addEventListener('submit', async (e) => {
              e.preventDefault();
              const form = e.target;
              const name = new FormData(form).get('name');
              if (name?.trim()) {
                await fetch('/api/items', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name })
                });
                form.reset();
                await fetchItems();
              }
            });

            fetchItems();
          `
        }} />
      </body>
    </html>
  )
})