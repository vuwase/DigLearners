import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Pages
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
import TeacherSignup from './pages/auth/TeacherSignup'
import LearnerApp from './pages/learner/LearnerApp'
import TeacherApp from './pages/teacher/TeacherApp'
// AdminApp removed; admin users are routed into TeacherApp
import TermsAndConditions from './pages/legal/TermsAndConditions'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import CookiesPolicy from './pages/legal/CookiesPolicy'
import HelpCenter from './pages/support/HelpCenter'
import FAQ from './pages/support/FAQ'
import CookiesBanner from './components/CookiesBanner'
import NotFound from './pages/public/NotFound'
import { NotificationProvider } from './components/common/NotificationSystem'
import LiveBot from './components/common/LiveBot'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth()
  
  // Check for token in localStorage as backup (in case state hasn't updated yet)
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('authToken')

  // Don't redirect while still checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #FFB3BA, #B9FBC0)',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '2rem',
          borderRadius: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2 style={{ color: '#2D3748', margin: '0 0 1rem 0' }}>Loading...</h2>
          <p style={{ color: '#4A5568', margin: 0 }}>Getting ready for your learning adventure!</p>
        </div>
      </div>
    )
  }

  // If we have a token but no user yet, wait a bit for auth context to initialize
  if (hasToken && !user && !loading) {
    console.log('[ProtectedRoute] Token exists but user not loaded yet, waiting...')
    // Give AuthContext a moment to load the user from token
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #FFB3BA, #B9FBC0)',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '2rem',
          borderRadius: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2 style={{ color: '#2D3748', margin: '0 0 1rem 0' }}>Loading...</h2>
          <p style={{ color: '#4A5568', margin: 0 }}>Verifying your account...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !hasToken) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to login', { isAuthenticated, user, hasToken })
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user?.role)) {
    console.log('[ProtectedRoute] User role not allowed', { userRole: user?.role, allowedRoles })
    return <Navigate to="/" replace />
  }

  console.log('[ProtectedRoute] Access granted', { userRole: user?.role, path: window.location.pathname })
  return children
}

// App Component
function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
              <LiveBot />
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

// Routes Component
function AppRoutes() {
  const { user, login, register, logout, isAuthenticated, loading } = useAuth()

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #FFB3BA, #B9FBC0)',
        fontFamily: 'Comic Sans MS, cursive, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '2rem',
          borderRadius: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2 style={{ color: '#2D3748', margin: '0 0 1rem 0' }}>Loading...</h2>
          <p style={{ color: '#4A5568', margin: 0 }}>Getting ready for your learning adventure!</p>
        </div>
      </div>
    )
  }

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials)
      // Return the full result from AuthContext which includes user, token, etc.
      return result || { success: true }
    } catch (error) {
      console.error('[AppRoutes] handleLogin error:', error)
      return { success: false, error: error.message }
    }
  }

  const handleRegister = async (userData) => {
    try {
      await register(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } 
      />
      <Route 
        path="/enroll" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <TeacherSignup />
        } 
      />
      
      {/* Legal Pages */}
      <Route path="/cookies" element={<CookiesPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Support Pages */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Protected Routes - Role-based Dashboards */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            {user?.role === 'learner' && <LearnerApp />}
            {(user?.role === 'teacher' || user?.role === 'admin') && <TeacherApp />}
            {!user && <Navigate to="/login" replace />}
          </ProtectedRoute>
        } 
      />

      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFound />} />
      </Routes>
      <CookiesBanner />
    </>
  )
}

export default App