import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Pages
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import LearnerApp from './pages/learner/LearnerApp'
import TeacherApp from './pages/teacher/TeacherApp'
import ParentApp from './pages/parent/ParentApp'
import AdminApp from './pages/admin/AdminApp'
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
    <BrowserRouter>
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
  const { user, login, register, logout, isAuthenticated } = useAuth()

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
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register onRegister={handleRegister} />
        } 
      />

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

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App