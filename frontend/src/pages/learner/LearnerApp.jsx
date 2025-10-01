// Learner App - Student Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import LearnerDashboard from './LearnerDashboard'

const LearnerApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'learner') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<LearnerDashboard />} />
        <Route path="/lessons" element={<div className="page-content"><h1>Lessons Page</h1></div>} />
        <Route path="/progress" element={<div className="page-content"><h1>Progress Page</h1></div>} />
        <Route path="/badges" element={<div className="page-content"><h1>Badges Page</h1></div>} />
        <Route path="/assignments" element={<div className="page-content"><h1>Assignments Page</h1></div>} />
        <Route path="/leaderboard" element={<div className="page-content"><h1>Leaderboard Page</h1></div>} />
        <Route path="/achievements" element={<div className="page-content"><h1>Achievements Page</h1></div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default LearnerApp
