// Error Boundary Component
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="error-content" style={{
            textAlign: 'center',
            maxWidth: '500px',
            padding: '2rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Oops! Something went wrong</h2>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>We're sorry, but something unexpected happened.</p>
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  background: '#0ea5a4',
                  color: 'white',
                  marginRight: '1rem'
                }}
              >
                Refresh Page
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                className="try-again-button"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  background: '#6c757d',
                  color: 'white'
                }}
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details" style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '500', marginBottom: '0.5rem' }}>Error Details (Development)</summary>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '4px', 
                  overflowX: 'auto', 
                  fontSize: '0.875rem' 
                }}>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
