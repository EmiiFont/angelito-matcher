export function GetStarted() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        padding: '32px',
        width: '100%',
        maxWidth: '500px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
          }}>
            <span style={{ fontSize: '24px' }}>🚀</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Get Started
          </h1>
          <p style={{ color: '#64748b', margin: '0' }}>
            Create your Angelito account and start organizing amazing gift exchanges
          </p>
        </div>

        <form id="signup-form" onsubmit="event.preventDefault(); window.handleLogin();" style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onfocus="this.style.borderColor='#8B5CF6'"
              onblur="this.style.borderColor='#e2e8f0'"
              placeholder="John Doe"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onfocus="this.style.borderColor='#8B5CF6'"
              onblur="this.style.borderColor='#e2e8f0'"
              placeholder="john@example.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onfocus="this.style.borderColor='#8B5CF6'"
              onblur="this.style.borderColor='#e2e8f0'"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 25px rgba(139, 92, 246, 0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(139, 92, 246, 0.3)'"
          >
            Create Account
          </button>
        </form>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          {[
            { emoji: '🎯', label: 'Smart Matching' },
            { emoji: '🔔', label: 'Auto Notifications' },
            { emoji: '🔒', label: 'Complete Privacy' }
          ].map((feature, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.emoji}</div>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: '500',
                margin: '0'
              }}>
                {feature.label}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            Already have an account?
          </p>
          <button
            onclick="window.navigateTo('auth')"
            style={{
              background: 'none',
              border: 'none',
              color: '#8B5CF6',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Sign in instead
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onclick="window.navigateTo('')"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}