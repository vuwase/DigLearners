// Parent App - Parent Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import ParentDashboard from './ParentDashboard'

const ParentApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'parent') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<ParentDashboard />} />
        <Route path="/children" element={<div className="page-content"><h1>My Children Page</h1></div>} />
        <Route path="/progress" element={<div className="page-content"><h1>Progress Reports Page</h1></div>} />
        <Route path="/achievements" element={<div className="page-content"><h1>Achievements Page</h1></div>} />
        <Route path="/schedule" element={<div className="page-content"><h1>Schedule Page</h1></div>} />
        <Route path="/communication" element={<div className="page-content"><h1>Communication Page</h1></div>} />
        <Route path="/reports" element={<div className="page-content"><h1>Reports Page</h1></div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default ParentApp
