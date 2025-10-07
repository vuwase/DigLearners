// Learner App - Student Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import LearnerDashboard from './LearnerDashboard'
import MyLessons from './MyLessons'
import Assignments from './Assignments'
import Leaderboard from './Leaderboard'
import Achievements from './Achievements'
import Progress from './Progress'

const LearnerApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'learner') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<LearnerDashboard />} />
        <Route path="/lessons" element={<MyLessons />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default LearnerApp
