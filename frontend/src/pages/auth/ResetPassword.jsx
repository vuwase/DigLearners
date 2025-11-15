import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { authService } from '../../services/authService'

const ResetPassword = () => {
  const { t } = useLanguage()
  const translate = (key, fallback) => {
    const value = t(key)
    if (!value || value === key) return fallback
    return value
  }
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token') || ''

  useEffect(() => {
    if (!token) {
      setError(translate('auth.resetTokenMissing', 'Reset token is missing. Please request a new link.'))
    }
  }, [token, t])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setError(translate('auth.resetTokenMissing', 'Reset token is missing. Please request a new link.'))
      return
    }
    if (!password || password.length < 6) {
      setError(translate('auth.passwordTooShort', 'Password must be at least 6 characters.'))
      return
    }
    if (password !== confirmPassword) {
      setError(translate('auth.passwordMismatch', 'Passwords do not match.'))
      return
    }

    try {
      setLoading(true)
      const response = await authService.resetPassword({ token, password })
      setSuccess(response?.message || translate('auth.passwordResetSuccess', 'Password updated successfully.'))
      setTimeout(() => navigate('/login?type=teacher'), 3500)
    } catch (err) {
      setError(err.message || translate('auth.passwordResetFailed', 'Unable to reset password. The link may have expired.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>{translate('auth.resetPasswordTitle', 'Reset Password')}</h1>
          <p>{translate('auth.resetPasswordSubtitle', 'Create a new password for your teacher account.')}</p>
        </div>

        {success && (
          <div className="success-message">
            <div className="success-icon">✅</div>
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
          <form onSubmit={handleSubmit} className="reset-password-form">
            <label htmlFor="password">{translate('auth.newPassword', 'New Password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              minLength={6}
              required
            />

            <label htmlFor="confirmPassword">{translate('auth.confirmPassword', 'Confirm Password')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              minLength={6}
              required
            />

            <button type="submit" disabled={loading || !token}>
              {loading ? translate('auth.updating', 'Updating...') : translate('auth.updatePassword', 'Update password')}
            </button>
          </form>
        )}

        <div className="reset-password-footer">
          <Link to="/login?type=teacher">
            {translate('auth.backToLogin', 'Back to teacher login')}
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .reset-password-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: radial-gradient(circle at top, #4f46e5, #3b82f6);
          font-family: 'Poppins', 'Inter', sans-serif;
        }
        .reset-password-card {
          width: 100%;
          max-width: 480px;
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 20px 40px rgba(15,23,42,0.25);
        }
        .reset-password-header h1 {
          margin: 0 0 0.5rem;
          color: #0f172a;
        }
        .reset-password-header p {
          margin: 0;
          color: #6b7280;
        }
        .reset-password-form {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .reset-password-form input {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
            padding: 0.85rem 1rem;
            font-size: 1rem;
            color: #0f172a;
            background: rgba(255,255,255,0.95);
        }
        .reset-password-form button {
          margin-top: 0.5rem;
          border: none;
          border-radius: 12px;
          padding: 0.9rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .reset-password-form input::placeholder {
          color: #9ca3af;
        }

        .reset-password-form label {
          color: #111827;
          font-weight: 600;
        }
        .reset-password-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .reset-password-footer {
          margin-top: 1.5rem;
          text-align: center;
        }
        .reset-password-footer a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
      ` }} />
    </div>
  )
}

export default ResetPassword

