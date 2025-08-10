export function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '24px', 
            fontWeight: '700',
            margin: '0'
          }}>
            Angelito
          </h1>
          <button 
            onclick="window.handleGetStarted()"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'; this.style.transform='scale(1.05)'"
            onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'; this.style.transform='scale(1)'"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          {/* Hero Section */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.1',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            Welcome to Angelito
          </h1>
          <p style={{
            fontSize: 'clamp(18px, 3vw, 28px)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Simple & beautiful gift exchange management for modern teams
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}>
            <button 
              onclick="window.handleGetStarted()"
              style={{
                backgroundColor: 'white',
                color: '#8B5CF6',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                minWidth: '200px'
              }}
              onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 40px rgba(0, 0, 0, 0.3)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0, 0, 0, 0.2)'"
            >
              Get Started Free
            </button>
            <button 
              onclick="window.navigateTo('auth')"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '200px'
              }}
              onmouseover="this.style.borderColor='white'; this.style.backgroundColor='rgba(255, 255, 255, 0.1)'"
              onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.5)'; this.style.backgroundColor='transparent'"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginTop: '80px'
        }}>
          {[
            { emoji: '🎯', title: 'Smart Matching', desc: 'Intelligent algorithms ensure perfect gift matches every time with advanced compatibility scoring' },
            { emoji: '🔔', title: 'Auto Notifications', desc: 'Never miss important updates with smart notifications and real-time event tracking' },
            { emoji: '🔒', title: 'Complete Privacy', desc: 'Your data is protected with enterprise-grade security and end-to-end encryption' }
          ].map((feature, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                padding: '40px 32px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-8px)'"
              onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'"
            >
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>{feature.emoji}</div>
              <h3 style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                fontSize: '16px',
                margin: '0'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}