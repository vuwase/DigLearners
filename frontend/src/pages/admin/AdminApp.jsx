// Admin App - Administrator Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import AdminDashboard from './AdminDashboard'
import UserManagement from './UserManagement'
import ContentManagement from './ContentManagement'
import Analytics from './Analytics'
import Settings from './Settings'
import Reports from './Reports'

const AdminApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default AdminApp
