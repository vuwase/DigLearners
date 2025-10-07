// Parent App - Parent Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import ParentDashboard from './ParentDashboard'
import ChildrenOverview from './ChildrenOverview'
import ProgressReports from './ProgressReports'
import Achievements from './Achievements'
import Schedule from './Schedule'
import Communication from './Communication'
import Reports from './Reports'

const ParentApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'parent') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<ParentDashboard />} />
        <Route path="/children" element={<ChildrenOverview />} />
        <Route path="/progress" element={<ProgressReports />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default ParentApp
