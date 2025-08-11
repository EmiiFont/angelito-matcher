import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface Item {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const createExampleItem = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Example Item ${Date.now()}`,
          description: "This is an example item created from the frontend"
        }),
      });
      
      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to create item:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => setCount((count) => count + 1)}
          aria-label="increment"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetch("/api/")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>api/index.ts</code> to change the name
        </p>
      </div>
      <div className="card">
        <button
          onClick={createExampleItem}
          disabled={loading}
          aria-label="create example item"
        >
          {loading ? "Loading..." : "Create Example Item"}
        </button>
        <button
          onClick={fetchItems}
          disabled={loading}
          aria-label="refresh items"
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Loading..." : "Refresh Items"}
        </button>
      </div>
      <div className="card">
        <h3>Items ({items.length})</h3>
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No items found. Click "Create Example Item" to add one!</p>
        ) : (
          <ul style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
                <strong>{item.name}</strong>
                {item.description && <p style={{ margin: "5px 0", color: "#666" }}>{item.description}</p>}
                <small style={{ color: "#999" }}>
                  Created: {new Date(item.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
