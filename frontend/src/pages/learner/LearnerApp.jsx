// Learner App - Student Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LearnerLayout from '../../components/layout/LearnerLayout'
import LearnerDashboard from './LearnerDashboard'
import Achievements from './Achievements'
import Lessons from './Lessons'
import AgeGroupSelector from '../../components/AgeGroupSelector'
import GamesDashboard from './GamesDashboard'
import GamePlayer from './GamePlayer'
import LessonPlayer from '../LessonPlayer'

const LearnerApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'learner') {
    return <Navigate to="/login" replace />
  }

  return (
    <LearnerLayout>
      <Routes>
        <Route path="/" element={<LearnerDashboard />} />
        <Route path="/age-select" element={<AgeGroupSelector />} />
        <Route path="/games" element={<GamesDashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/game/:gameId" element={<GamePlayer />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LearnerLayout>
  )
}

export default LearnerApp
