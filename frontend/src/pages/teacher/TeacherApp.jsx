// Teacher App - Teacher Interface
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import TeacherDashboard from './TeacherDashboard'
import MyClasses from './MyClasses'
import Students from './Students'
import Lessons from './Lessons'
import Assignments from './Assignments'
import Analytics from './Analytics'
import Schedule from './Schedule'

const TeacherApp = () => {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'teacher') {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/classes" element={<MyClasses />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default TeacherApp
