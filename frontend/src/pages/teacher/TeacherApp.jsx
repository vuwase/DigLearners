// Teacher App - Teacher Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import TeacherDashboard from './TeacherDashboard'
import Students from './Students'
import Lessons from './Lessons'
import Assignments from './Assignments'
import Analytics from './Analytics'
import Schedule from './Schedule'
import StudentRegistration from './StudentRegistration'
// Admin features now available within TeacherApp
import AdminDashboard from '../admin/AdminDashboard'
import UserManagement from '../admin/UserManagement'
import ContentManagement from '../admin/ContentManagement'
import AdminSettings from '../admin/Settings'
import AdminReports from '../admin/Reports'

const TeacherApp = () => {
  const { user, logout, loading } = useAuth()

  // Wait for auth to initialize
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
          <h2 style={{ color: '#2D3748', margin: '0 0 1rem 0' }}>Loading...</h2>
          <p style={{ color: '#4A5568', margin: 0 }}>Setting up your teacher dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    console.log('[TeacherApp] User not authorized, redirecting to login', { user, loading })
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/register-student" element={<StudentRegistration />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/schedule" element={<Schedule />} />
        {/* Admin routes embedded for teachers/admins */}
        <Route path="/users" element={<UserManagement />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/reports" element={<AdminReports />} />
        {/* Optional: admin dashboard entry under teacher shell */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default TeacherApp
