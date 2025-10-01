// Loading Screen Component
import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="loading-screen" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0ea5a4, #06b6d4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="loading-content" style={{
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="loading-spinner" style={{ marginBottom: '2rem' }}>
          <div className="spinner" style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>DigLearners</h2>
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.9
        }}>Loading your digital learning experience...</p>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  )
}

export default LoadingScreen
