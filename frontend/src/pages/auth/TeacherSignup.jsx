// Teacher Signup Page - Professional Design
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../components/icons/Icon'

const TeacherSignup = () => {
  const { t } = useLanguage()
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null) // Changed to null to store success data

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.fullName.trim()) {
      setError(t('auth.fullNameRequired') || 'Full name is required')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError(t('auth.emailRequired'))
      setLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError(t('auth.emailInvalid'))
      setLoading(false)
      return
    }

    if (!formData.password) {
      setError(t('auth.passwordRequired'))
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'))
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      setLoading(false)
      return
    }

    try {
      console.log('Attempting to register teacher:', { 
        fullName: formData.fullName.trim(), 
        email: formData.email.trim(),
        role: 'teacher'
      })
      
      const result = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'teacher'
      })

      console.log('Registration result:', result)

      if (!result.success) {
        const errorMsg = result.error || t('auth.registerError')
        console.error('Registration failed:', errorMsg, result)
        setError(errorMsg)
      } else {
        console.log('Registration successful! User created:', result.user)
        console.log('User ID:', result.user?.id || result.userId)
        console.log('User email:', result.user?.email || formData.email.trim())
        console.log('User role:', result.user?.role)
        console.log('User created flag:', result.userCreated)
        console.log('You can now login with email:', formData.email.trim())
        
        // Verify user object exists
        if (!result.user && !result.userId) {
          console.warn('WARNING: Registration succeeded but no user data returned!')
          setError('Registration succeeded but user data is missing. Please try logging in.')
          return
        }
        
        setSuccess({
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
          userId: result.user?.id || result.userId,
          message: result.message
        })
        setTimeout(() => {
          navigate('/login?type=teacher')
        }, 4000) // Increased to 4 seconds so user can read the message
      }
    } catch (err) {
      console.error('Registration exception:', err)
      const errorMsg = err.message || err.response?.data?.error || t('auth.registerError')
      
      // Add more detailed error information
      let detailedError = errorMsg
      if (err.status) {
        detailedError += ` (Status: ${err.status})`
      }
      if (err.data && typeof err.data === 'object') {
        console.error('Error details:', err.data)
      }
      
      setError(detailedError)
    }
    
    setLoading(false)
  }

  return (
    <div className="teacher-signup-page">
      <div className="teacher-signup-container">
        <div className="teacher-signup-header">
          <div className="teacher-signup-badge">
            <Icon name="achievement" size={24} />
            <span>{t('auth.teacherSignup') || 'TEACHER REGISTRATION'}</span>
          </div>
          <h1>{t('auth.teacherSignupTitle') || 'Teacher Sign Up'} 👨‍🏫</h1>
          <p>{t('auth.teacherSignupSubtitle') || 'Create your teacher account to start managing students and lessons!'}</p>
        </div>

        {success && (
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <div className="success-content">
              <div className="success-title">🌟 {t('auth.registerSuccess') || 'Welcome to DigLearners!'} 🌟</div>
              <div className="success-text">
                {t('auth.teacherSignupSuccess') || 'Congratulations! Your teacher account has been created successfully. You can now manage your students and lessons.'}
              </div>
              {success.email && (
                <div className="success-account-info">
                  <p><strong>{t('auth.email') || 'Email'}:</strong> {success.email}</p>
                  {success.fullName && (
                    <p><strong>{t('auth.fullName') || 'Name'}:</strong> {success.fullName}</p>
                  )}
                  {success.userId && (
                    <p style={{fontSize: '0.85rem', color: '#059669', fontStyle: 'italic'}}>
                      ✓ User ID: {success.userId} (stored in database)
                    </p>
                  )}
                </div>
              )}
              <div className="success-note">
                {t('auth.accountReadyToLogin') || 'Your account is ready! You can now login with the email and password you just created.'}
              </div>
              <div className="success-action">
                {t('auth.redirectingToLogin') || 'Redirecting you to the login page...'}
              </div>
              <div className="success-progress">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-icon">❌</div>
            <div className="error-content">
              <div className="error-title">{t('auth.registrationError') || 'Registration Error'}</div>
              <div className="error-text">{error}</div>
              <div className="error-help">
                {t('auth.errorHelpText') || 'Please check the information above and try again. If the problem persists, ensure the backend server is running.'}
              </div>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="teacher-signup-form">
            <div className="form-section">
              <h3>👨‍🏫 {t('auth.teacherInfo') || 'Teacher Information'}</h3>
              
              <div className="form-group">
                <label htmlFor="fullName">{t('auth.fullName')}</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.fullNamePlaceholder') || 'Enter your full name'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t('auth.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                />
                <small>{t('auth.emailHint') || 'This email will be used for your teacher account'}</small>
              </div>

              <div className="form-group">
                <label htmlFor="password">{t('auth.password')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <small>{t('auth.passwordHint') || 'At least 6 characters'}</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.confirmPasswordPlaceholder') || 'Re-enter your password'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`teacher-signup-btn ${success ? 'success' : ''}`}
              disabled={loading || success}
            >
              {success ? (
                <>
                  <span>✅</span>
                  {t('auth.registrationSuccessful') || 'Registration Successful!'}
                </>
              ) : loading ? (
                <>
                  <Icon name="recent" size={20} />
                  {t('auth.registering') || 'Registering...'}
                </>
              ) : (
                <>
                  <Icon name="star" size={20} />
                  {t('auth.signUpNow') || 'Sign Up Now!'} 🎉
                </>
              )}
            </button>
          </form>
        )}

        <div className="teacher-signup-footer">
          <p>
            {t('auth.alreadyHaveAccount') || 'Already have an account?'}{' '}
            <Link to="/login?type=teacher">{t('auth.teacherLogin') || 'Teacher Login'}</Link>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .teacher-signup-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #1E3A8A, #059669);
            padding: 2rem;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .teacher-signup-container {
            max-width: 600px;
            width: 100%;
            background: white;
            border-radius: 25px;
            padding: 3rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
          }

          .teacher-signup-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: shimmer 3s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }

          .teacher-signup-header {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
            z-index: 1;
          }

          .teacher-signup-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #1E3A8A, #059669);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
            box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
          }

          .teacher-signup-header h1 {
            color: #1E3A8A;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .teacher-signup-header p {
            color: #6b7280;
            font-size: 1.1rem;
            margin: 0;
          }

          .success-message, .error-message {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .success-message {
            background: linear-gradient(135deg, #d1fae5, #ecfdf5);
            color: #065f46;
            border: 2px solid #10b981;
            animation: successSlide 0.5s ease-out;
            padding: 2rem;
            gap: 1.5rem;
          }

          .success-icon {
            font-size: 2rem;
            flex-shrink: 0;
            animation: bounce 2s ease-in-out infinite;
          }

          .success-progress {
            width: 100%;
            height: 4px;
            background: rgba(16, 185, 129, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 1rem;
          }

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 2px;
            animation: progressLoad 4s ease-out;
          }

          @keyframes progressLoad {
            from { width: 0%; }
            to { width: 100%; }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }

          @keyframes successSlide {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .success-content {
            flex: 1;
          }

          .success-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #065f46;
            margin-bottom: 0.5rem;
          }

          .success-text {
            font-size: 0.95rem;
            color: #047857;
            margin-bottom: 0.5rem;
            line-height: 1.4;
          }

          .success-action {
            font-size: 0.85rem;
            color: #059669;
            font-style: italic;
          }

          .success-account-info {
            background: rgba(16, 185, 129, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }

          .success-account-info p {
            margin: 0.5rem 0;
            font-size: 0.95rem;
            color: #047857;
          }

          .success-account-info strong {
            color: #065f46;
            margin-right: 0.5rem;
          }

          .success-note {
            background: rgba(255, 255, 255, 0.5);
            padding: 0.75rem;
            border-radius: 6px;
            margin: 0.75rem 0;
            font-size: 0.9rem;
            color: #047857;
            border-left: 3px solid #10b981;
          }

          .error-message {
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            color: #991b1b;
            border: 2px solid #ef4444;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
            animation: errorSlide 0.5s ease-out;
          }

          @keyframes errorSlide {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .error-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
          }

          .error-content {
            flex: 1;
          }

          .error-title {
            font-weight: 700;
            font-size: 1rem;
            margin-bottom: 0.5rem;
            color: #7f1d1d;
          }

          .error-text {
            font-size: 0.95rem;
            margin-bottom: 0.75rem;
            line-height: 1.5;
          }

          .error-help {
            font-size: 0.85rem;
            color: #b91c1c;
            font-style: italic;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(239, 68, 68, 0.3);
          }

          .teacher-signup-form {
            position: relative;
            z-index: 1;
          }

          .form-section {
            margin-bottom: 2rem;
          }

          .form-section h3 {
            color: #374151;
            font-size: 1.3rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #374151;
            font-weight: 600;
            font-size: 0.95rem;
          }

          .form-group input {
            width: 100%;
            padding: 0.875rem;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .form-group input:focus {
            outline: none;
            border-color: #1E3A8A;
            box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
            transform: translateY(-2px);
          }

          .form-group small {
            display: block;
            margin-top: 0.5rem;
            color: #6b7280;
            font-size: 0.85rem;
          }

          .teacher-signup-btn {
            width: 100%;
            background: linear-gradient(135deg, #1E3A8A, #059669);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
            box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
          }

          .teacher-signup-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(30, 58, 138, 0.4);
          }

          .teacher-signup-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .teacher-signup-btn.success {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            transform: scale(1.02) !important;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
          }

          .teacher-signup-footer {
            text-align: center;
            margin-top: 2rem;
            position: relative;
            z-index: 1;
          }

          .teacher-signup-footer p {
            color: #6b7280;
            margin: 0;
          }

          .teacher-signup-footer a {
            color: #1E3A8A;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
          }

          .teacher-signup-footer a:hover {
            color: #059669;
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .teacher-signup-container {
              margin: 1rem;
              padding: 2rem;
            }

            .teacher-signup-header h1 {
              font-size: 2rem;
            }
          }
        `
      }} />
    </div>
  )
}

export default TeacherSignup

