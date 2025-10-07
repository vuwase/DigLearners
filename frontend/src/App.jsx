import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Pages
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
import Enroll from './pages/auth/Enroll'
import LearnerApp from './pages/learner/LearnerApp'
import TeacherApp from './pages/teacher/TeacherApp'
import ParentApp from './pages/parent/ParentApp'
import AdminApp from './pages/admin/AdminApp'
import TermsAndConditions from './pages/legal/TermsAndConditions'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import CookiesPolicy from './pages/legal/CookiesPolicy'
import HelpCenter from './pages/support/HelpCenter'
import FAQ from './pages/support/FAQ'
import CookiesBanner from './components/CookiesBanner'
import NotFound from './pages/public/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

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
            <AppRoutes />
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
      await login(credentials)
      return { success: true }
    } catch (error) {
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
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Enroll />
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
            {user?.role === 'teacher' && <TeacherApp />}
            {user?.role === 'parent' && <ParentApp />}
            {user?.role === 'admin' && <AdminApp />}
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