// Login Page Component
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import TeacherLogin from './TeacherLogin'
import StudentLogin from './StudentLogin'
import './Login.css'

const Login = ({ onLogin }) => {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState(null) // 'teacher' or 'student'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleStudentRegistration = (e) => {
    e.preventDefault()
    if (isAuthenticated && (user?.role === 'teacher' || user?.role === 'admin')) {
      navigate('/dashboard/register-student')
    } else {
      // Redirect to teacher login first
      navigate('/login?type=teacher')
    }
  }

  // Check URL parameters to auto-select login type
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const typeParam = urlParams.get('type')
    if (typeParam === 'student' || typeParam === 'teacher') {
      setLoginType(typeParam)
    }
  }, [location.search])

  // Helper functions for error handling
  const getErrorClass = (error) => {
    if (typeof error === 'string') {
      if (error.includes('email')) return 'error-email'
      if (error.includes('password')) return 'error-password'
      if (error.includes('account')) return 'error-account'
      if (error.includes('network') || error.includes('connection') || error.includes('timeout')) return 'error-network'
      if (error.includes('server') || error.includes('service')) return 'error-server'
      return 'error-general'
    }
    return 'error-general'
  }

  const getErrorIcon = (error) => {
    if (typeof error === 'string') {
      if (error.includes('email')) return '📧'
      if (error.includes('password')) return '🔒'
      if (error.includes('account')) return '👤'
      if (error.includes('network') || error.includes('connection') || error.includes('timeout')) return '🌐'
      if (error.includes('server') || error.includes('service')) return '🔧'
      return '⚠️'
    }
    return '⚠️'
  }

  const getErrorTitle = (error) => {
    if (typeof error === 'string') {
      if (error.includes('email')) return 'Email Issue'
      if (error.includes('password')) return 'Password Issue'
      if (error.includes('account')) return 'Account Issue'
      if (error.includes('network') || error.includes('connection') || error.includes('timeout')) return 'Connection Issue'
      if (error.includes('server') || error.includes('service')) return 'Server Issue'
      return 'Login Error'
    }
    return 'Login Error'
  }

  const getErrorSuggestion = (error) => {
    if (typeof error === 'string') {
      if (error.includes('email')) return '💡 Try checking your email address or create a new account'
      if (error.includes('password')) return '💡 Double-check your password or contact support for help'
      if (error.includes('account')) return '💡 Need help? Contact our support team'
      if (error.includes('network') || error.includes('connection') || error.includes('timeout')) return '💡 Check your internet connection and try again'
      if (error.includes('server') || error.includes('service')) return '💡 Our servers are temporarily busy. Please try again in a few minutes'
      return null
    }
    return null
  }

  const handleLoginTypeSelect = (type) => {
    setLoginType(type)
    setError('')
    setSuccess(false)
  }

  const handleBackToSelection = () => {
    setLoginType(null)
    setError('')
    setSuccess(false)
  }

  // Show login type selection if no type is selected
  if (!loginType) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>DigLearners</h1>
            <p>Digital Literacy Platform</p>
          </div>
          
          <div className="login-type-selection">
            <h2>{t('auth.selectLoginType')}</h2>
            <p className="selection-subtitle">{t('auth.selectLoginSubtitle')}</p>
            
            <div className="login-type-buttons">
              <button 
                className="login-type-button teacher-button"
                onClick={() => handleLoginTypeSelect('teacher')}
              >
                <div className="button-icon">👨‍🏫</div>
                <div className="button-content">
                  <h3>{t('auth.teacherLogin')}</h3>
                  <p>{t('auth.teacherLoginDesc')}</p>
                </div>
              </button>
              
              <button 
                className="login-type-button student-button"
                onClick={() => handleLoginTypeSelect('student')}
              >
                <div className="button-icon">👨‍🎓</div>
                <div className="button-content">
                  <h3>{t('auth.studentLogin')}</h3>
                  <p>{t('auth.studentLoginDesc')}</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="login-footer">
            <p>
              {t('auth.studentNotRegistered') || 'Student not registered yet?'}{' '}
              <a href="#" onClick={handleStudentRegistration}>
                {t('auth.registerStudentHere') || 'Register the student here'}
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show the appropriate login form based on selected type
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>DigLearners</h1>
          <p>Digital Literacy Platform</p>
        </div>
        
        <div className="back-button-container">
          <button 
            className="back-button"
            onClick={handleBackToSelection}
          >
            ← {t('common.back')}
          </button>
        </div>

        {loginType === 'teacher' ? (
          <TeacherLogin 
            onLogin={onLogin}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        ) : (
          <StudentLogin 
            onLogin={onLogin}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        )}
        
        <div className="login-footer">
          <p>
            {t('auth.studentNotRegistered') || 'Student not registered yet?'}{' '}
            <a href="#" onClick={handleStudentRegistration}>
              {t('auth.registerStudentHere') || 'Register the student here'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
