import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { authService } from '../../services/authService'

const ForgotPassword = () => {
  const { t } = useLanguage()
  const translate = (key, fallback) => {
    const value = t(key)
    if (!value || value === key) return fallback
    return value
  }
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(null)

    if (!email.trim()) {
      setError(translate('auth.emailRequired', 'Email is required'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError(translate('auth.emailInvalid', 'Please enter a valid email'))
      return
    }

    try {
      setLoading(true)
      const response = await authService.requestPasswordReset(email.trim())
      setSuccess(response?.message || translate('auth.resetLinkSent', 'If that email exists, a reset link has been sent.'))
    } catch (err) {
      setError(err.message || translate('auth.resetRequestFailed', 'Unable to send reset link. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>{translate('auth.forgotPasswordTitle', 'Forgot Password')}</h1>
          <p>{translate('auth.forgotPasswordSubtitle', 'Enter your email and we will send you a link to reset your password.')}</p>
        </div>

        {success && (
          <div className="success-message">
            <div className="success-icon">📬</div>
            <div>
              <strong>{translate('common.success', 'Success')}</strong>
              <p>{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div>
              <strong>{translate('common.error', 'Error')}</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <label htmlFor="email">{translate('auth.email', 'Email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translate('auth.emailPlaceholder', 'name@school.com')}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? translate('auth.sending', 'Sending...') : translate('auth.sendResetLink', 'Send reset link')}
            </button>
          </form>
        )}

        <div className="forgot-password-footer">
          <Link to="/login?type=teacher">
            {translate('auth.backToLogin', 'Back to teacher login')}
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .forgot-password-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC);
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .forgot-password-form label {
          color: #111827;
          font-weight: 600;
        }

        .forgot-password-form input::placeholder {
          color: #9ca3af;
        }
        .forgot-password-card {
          width: 100%;
          max-width: 480px;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .forgot-password-header h1 {
          margin: 0 0 0.5rem;
          color: #111827;
        }
        .forgot-password-header p {
          margin: 0;
          color: #6b7280;
        }
        .forgot-password-form {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .forgot-password-form input {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.85rem 1rem;
          font-size: 1rem;
        }
        .forgot-password-form button {
          border: none;
          border-radius: 999px;
          padding: 0.9rem 1.25rem;
          background: linear-gradient(135deg, #F97316, #FACC15);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .forgot-password-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .success-message, .error-message {
          margin-top: 1.25rem;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .success-message {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        .error-message {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        .forgot-password-footer {
          margin-top: 1.5rem;
          text-align: center;
        }
        .forgot-password-footer a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
      ` }} />
    </div>
  )
}

export default ForgotPassword

