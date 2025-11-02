// Teacher Login Component - Email/Password Authentication
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const TeacherLogin = ({ 
  onLogin, 
  loading, 
  setLoading, 
  error, 
  setError, 
  success, 
  setSuccess 
}) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
    loginType: 'teacher'
  })

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Client-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email || !emailRegex.test(formData.email)) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }
      if (!formData.password || formData.password.length < 4) {
        setError('Please enter your password')
        setLoading(false)
        return
      }

      console.log('[TeacherLogin] Attempting teacher login:', { email: formData.email })
      console.log('[TeacherLogin] Form data:', { ...formData, password: '***' })
      
      const result = await onLogin(formData)
      
      console.log('[TeacherLogin] Login result received:', {
        success: result?.success,
        hasUser: !!result?.user,
        hasToken: !!result?.token,
        error: result?.error,
        message: result?.message
      })
      
      if (!result) {
        console.error('[TeacherLogin] ERROR: No result returned from onLogin!')
        setError('No response received from login service. Please check your connection.')
        return
      }
      
      if (!result.success) {
        const errorMsg = result.error || t('auth.loginError')
        console.error('[TeacherLogin] Login failed:', errorMsg)
        console.error('[TeacherLogin] Full result:', result)
        setError(errorMsg)
      } else {
        console.log('[TeacherLogin] Login successful! User:', result.user?.email)
        console.log('[TeacherLogin] Token received:', !!result.token)
        setSuccess(true)
        // Show success message briefly before redirect
        setTimeout(() => {
          console.log('[TeacherLogin] Redirecting to dashboard...')
          navigate('/dashboard', { replace: true })
          // Fallback hard redirect if router state hasn't updated
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
              console.log('[TeacherLogin] Fallback redirect to dashboard')
              window.location.assign('/dashboard')
            }
          }, 150)
        }, 800)
      }
    } catch (err) {
      console.error('Login exception:', err)
      // Enhanced error handling for specific error types
      let errorMsg = t('auth.loginError')
      if (err.type) {
        errorMsg = err.message
      } else if (err.message) {
        errorMsg = err.message
      }
      
      // Add status code if available for debugging
      if (err.status) {
        errorMsg += ` (Status: ${err.status})`
      }
      
      console.error('Login error details:', {
        message: errorMsg,
        status: err.status,
        type: err.type
      })
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{t('auth.teacherLogin')}</h2>
      <p className="login-subtitle">{t('auth.teacherLoginSubtitle')}</p>
      
      {success && (
        <div className="success-message">
          <div className="success-icon">
            🎉
          </div>
          <div className="success-content">
            <div className="success-title">
              🌟 Welcome Back, Teacher! 🌟
            </div>
            <div className="success-text">
              Login successful! Taking you to your teacher dashboard where you can manage your students and lessons...
            </div>
            <div className="success-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className={`error-message ${getErrorClass(error)}`}>
          <div className="error-icon">
            {getErrorIcon(error)}
          </div>
          <div className="error-content">
            <div className="error-title">
              {getErrorTitle(error)}
            </div>
            <div className="error-text">
              {error}
            </div>
            {getErrorSuggestion(error) && (
              <div className="error-suggestion">
                {getErrorSuggestion(error)}
              </div>
            )}
          </div>
        </div>
      )}
      
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
          placeholder={t('auth.passwordPlaceholder')}
        />
      </div>
      
      <div className="form-group remember-me">
        <label className="remember-me-label">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="remember-me-checkbox"
          />
          <span className="checkmark"></span>
          <span className="remember-me-text">🔒 {t('auth.rememberMe')}</span>
        </label>
      </div>
      
      <button 
        type="submit" 
        className={`login-button ${success ? 'success' : ''}`}
        disabled={loading || success}
      >
        {success ? (
          <>
            <span>✅</span>
            Login Successful!
          </>
        ) : loading ? (
          <>
            <span className="loading-spinner">⏳</span>
            {t('common.loading')}
          </>
        ) : (
          t('auth.login')
        )}
      </button>

      <style dangerouslySetInnerHTML={{
        __html: `
          .login-form {
            width: 100%;
          }

          .login-form h2 {
            color: #374151;
            margin-bottom: 0.5rem;
            text-align: center;
            font-size: 1.5rem;
          }

          .login-subtitle {
            color: #6b7280;
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #374151;
            font-weight: 500;
          }

          .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }

          .form-group input:focus {
            outline: none;
            border-color: #FF677D;
          }

          .error-message {
            background: #fef2f2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #fecaca;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .error-message.error-email {
            background: #fffbeb;
            border-color: #fed7aa;
            color: #ea580c;
          }

          .error-message.error-password {
            background: #fef2f2;
            border-color: #fecaca;
            color: #dc2626;
          }

          .error-message.error-account {
            background: #f0f9ff;
            border-color: #bfdbfe;
            color: #1d4ed8;
          }

          .error-message.error-network {
            background: #fef3c7;
            border-color: #fbbf24;
            color: #92400e;
          }

          .error-message.error-server {
            background: #f3e8ff;
            border-color: #c084fc;
            color: #6b21a8;
          }

          .error-icon {
            font-size: 1.5rem;
            margin-top: 0.125rem;
            flex-shrink: 0;
          }

          .error-content {
            flex: 1;
          }

          .error-title {
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .error-text {
            font-size: 0.875rem;
            line-height: 1.4;
            margin-bottom: 0.5rem;
          }

          .error-suggestion {
            font-size: 0.75rem;
            color: #6b7280;
            font-style: italic;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }

          .success-message {
            background: linear-gradient(135deg, #d1fae5, #ecfdf5);
            color: #065f46;
            border: 2px solid #10b981;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
            animation: successSlide 0.5s ease-out;
          }

          @keyframes successSlide {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .success-icon {
            font-size: 1.5rem;
            margin-top: 0.125rem;
            flex-shrink: 0;
          }

          .success-content {
            flex: 1;
          }

          .success-title {
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: #065f46;
          }

          .success-text {
            font-size: 0.95rem;
            line-height: 1.4;
            color: #047857;
            margin-bottom: 1rem;
          }

          .success-progress {
            width: 100%;
            height: 4px;
            background: rgba(16, 185, 129, 0.2);
            border-radius: 2px;
            overflow: hidden;
          }

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 2px;
            animation: progressLoad 1.5s ease-out;
          }

          @keyframes progressLoad {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
          
          .login-button {
            width: 100%;
            background: linear-gradient(135deg, #FF677D, #F8B400);
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .login-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 103, 125, 0.3);
          }
          
          .login-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }

          .login-button.success {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }

          .loading-spinner {
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 0.5rem;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .remember-me {
            margin-bottom: 1rem;
          }
          
          .remember-me-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 0.9rem;
            color: #4A5568;
          }
          
          .remember-me-checkbox {
            display: none;
          }
          
          .checkmark {
            width: 20px;
            height: 20px;
            border: 2px solid #FF677D;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            background: white;
          }
          
          .remember-me-checkbox:checked + .checkmark {
            background: #FF677D;
            color: white;
          }
          
          .remember-me-checkbox:checked + .checkmark::after {
            content: '✓';
            font-weight: bold;
            font-size: 14px;
          }
          
          .remember-me-text {
            font-weight: 500;
          }
        `
      }} />
    </form>
  )
}

export default TeacherLogin
