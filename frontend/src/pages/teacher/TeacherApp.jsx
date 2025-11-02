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
  const { user, logout } = useAuth()

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
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
