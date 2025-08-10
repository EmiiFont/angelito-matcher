export function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e2e8f0'
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
            color: '#1e293b',
            fontSize: '24px',
            fontWeight: '700',
            margin: '0'
          }}>
            Angelito Dashboard
          </h1>
          <button 
            onclick="window.handleLogout()"
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onmouseover="this.style.backgroundColor='#dc2626'"
            onmouseout="this.style.backgroundColor='#ef4444'"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Welcome back!
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '18px',
              margin: '0'
            }}>
              Manage your gift exchanges and events
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {[
              { label: 'Active Events', value: '3', color: '#8b5cf6', desc: 'Currently running' },
              { label: 'Total Participants', value: '47', color: '#10b981', desc: 'Across all events' },
              { label: 'Completed', value: '12', color: '#f59e0b', desc: 'Successfully matched' }
            ].map((stat, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  transition: 'box-shadow 0.2s ease'
                }}
                onmouseover="this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'"
                onmouseout="this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'"
              >
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                  margin: '0 0 12px 0'
                }}>
                  {stat.label}
                </h3>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: stat.color,
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <p style={{
                  color: '#64748b',
                  fontSize: '14px',
                  margin: '0'
                }}>
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Events Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0'
              }}>
                Recent Events
              </h3>
              <button style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(139, 92, 246, 0.4)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.3)'"
              >
                Create New Event
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Holiday Gift Exchange 2024', desc: '15 participants • Ends Dec 20th', status: 'Active', color: '#10b981' },
                  { title: 'Team Building Exchange', desc: '8 participants • Ends Jan 15th', status: 'Planned', color: '#3b82f6' },
                  { title: 'Birthday Surprise', desc: '12 participants • Completed Nov 30th', status: 'Completed', color: '#64748b' }
                ].map((event, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s ease',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                    onmouseover="this.style.backgroundColor='#f1f5f9'"
                    onmouseout="this.style.backgroundColor='#f8fafc'"
                  >
                    <div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '4px',
                        margin: '0 0 4px 0'
                      }}>
                        {event.title}
                      </h4>
                      <p style={{
                        color: '#64748b',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {event.desc}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: event.color,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}