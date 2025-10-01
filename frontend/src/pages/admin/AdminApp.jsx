// Admin App - Administrator Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import AdminDashboard from './AdminDashboard'

const AdminApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<div className="page-content"><h1>User Management Page</h1></div>} />
        <Route path="/content" element={<div className="page-content"><h1>Content Management Page</h1></div>} />
        <Route path="/analytics" element={<div className="page-content"><h1>Analytics Page</h1></div>} />
        <Route path="/settings" element={<div className="page-content"><h1>Settings Page</h1></div>} />
        <Route path="/reports" element={<div className="page-content"><h1>Reports Page</h1></div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default AdminApp
