// Login Page Component
import React, { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const Login = ({ onLogin }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const result = await onLogin(formData)
      if (!result.success) {
        setError(result.error || t('auth.loginError'))
      }
    } catch (err) {
      setError(t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>DigLearners</h1>
          <p>Digital Literacy Platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <h2>{t('auth.login')}</h2>
          
          {error && (
            <div className="error-message">
              {error}
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.login')}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .login-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #0ea5a4, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .login-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 3rem;
            width: 100%;
            max-width: 400px;
          }
          
          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .login-header h1 {
            color: #0ea5a4;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }
          
          .login-header p {
            color: #6b7280;
            font-size: 1.1rem;
          }
          
          .login-form h2 {
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
          
          .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
          }
          
          .form-group input:focus {
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
          
          .login-button {
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
          
          .login-button:hover:not(:disabled) {
            background: #0d9488;
          }
          
          .login-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
          
          .login-footer {
            text-align: center;
            margin-top: 1.5rem;
          }
          
          .login-footer a {
            color: #0ea5a4;
            text-decoration: none;
          }
          
          .login-footer a:hover {
            text-decoration: underline;
          }
        `
      }} />
    </div>
  )
}

export default Login
