// Register Page Component
import React, { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const Register = ({ onRegister }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      setLoading(false)
      return
    }

    try {
      const result = await onRegister(formData)
      if (!result.success) {
        setError(result.error || t('auth.registerError'))
      }
    } catch (err) {
      setError(t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>DigLearners</h1>
          <p>Join the digital learning community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <h2>{t('auth.register')}</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="fullName">{t('auth.fullName')}</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">{t('auth.role')}</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="learner">{t('role.learner')}</option>
              <option value="teacher">{t('role.teacher')}</option>
              <option value="parent">{t('role.parent')}</option>
            </select>
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
              minLength="6"
              placeholder="Enter your password"
            />
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
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.register')}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0ea5a4, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .register-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          width: 100%;
          max-width: 450px;
        }
        
        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .register-header h1 {
          color: #0ea5a4;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .register-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }
        
        .register-form h2 {
          color: #374151;
          margin-bottom: 1.5rem;
          text-align: center;
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
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #0ea5a4;
        }
        
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          border: 1px solid #fecaca;
        }
        
        .register-button {
          width: 100%;
          background: #0ea5a4;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .register-button:hover:not(:disabled) {
          background: #0d9488;
        }
        
        .register-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .register-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        
        .register-footer a {
          color: #0ea5a4;
          text-decoration: none;
        }
        
        .register-footer a:hover {
          text-decoration: underline;
        }
        `
      }} />
    </div>
  )
}

export default Register
