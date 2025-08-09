export function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Angelito
          </h1>
          <p style={{ 
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Simple & beautiful task management
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          padding: '40px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '30px'
          }}>
            Your Items
          </h2>
          
          <form id="add-item-form" style={{ 
            display: 'flex',
            gap: '12px',
            marginBottom: '30px'
          }}>
            <input 
              type="text" 
              name="name" 
              placeholder="Add a new item..."
              style={{ 
                flex: '1',
                padding: '14px 18px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button 
              type="submit"
              style={{ 
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              Add Item
            </button>
          </form>

          <div>
            <ul id="items-list" style={{ 
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}>
            </ul>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px'
        }}>
          Made with ❤️ using Hono & Cloudflare Workers
        </div>
      </div>
    </div>
  )
}