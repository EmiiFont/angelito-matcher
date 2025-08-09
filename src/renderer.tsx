import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <hr />
        <h2>Items</h2>
        <ul id="items-list"></ul>
        <form id="add-item-form">
          <input type="text" name="name" />
          <button type="submit">Add Item</button>
        </form>
        <script dangerouslySetInnerHTML={{
          __html: `
            async function fetchItems() {
              const res = await fetch('/api/items');
              const items = await res.json();
              const list = document.getElementById('items-list');
              list.innerHTML = items.map(item => \`<li>\${item.name}</li>\`).join('');
            }

            document.getElementById('add-item-form').addEventListener('submit', async (e) => {
              e.preventDefault();
              const form = e.target;
              const name = new FormData(form).get('name');
              await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
              });
              form.reset();
              await fetchItems();
            });

            fetchItems();
          `
        }} />
      </body>
    </html>
  )
})