// Parent Enrollment Page - Kid-Friendly Design
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../components/icons/Icon'

const Enroll = () => {
  const { t } = useLanguage()
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPassword: '',
    confirmPassword: '',
    childName: '',
    childEmail: '',
    childPassword: '',
    confirmChildPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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

    if (formData.parentPassword !== formData.confirmPassword) {
      setError('Parent passwords do not match')
      setLoading(false)
      return
    }

    if (formData.childPassword !== formData.confirmChildPassword) {
      setError('Child passwords do not match')
      setLoading(false)
      return
    }

    if (formData.childPassword.length < 6) {
      setError('Child password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await register({
        fullName: formData.parentName,
        email: formData.parentEmail,
        password: formData.parentPassword,
        role: 'parent',
        childName: formData.childName,
        childEmail: formData.childEmail,
        childPassword: formData.childPassword
      })

      if (!result.success) {
        setError(result.error || 'Registration failed')
      } else {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="enroll-page">
      <div className="enroll-container">
        <div className="enroll-header">
          <div className="enroll-badge">
            <Icon name="achievement" size={24} />
            <span>ENROLL YOUR CHILD</span>
          </div>
          <h1>Enroll My Child 🎓</h1>
          <p>Create your parent account and add your child to start their digital learning journey!</p>
        </div>

        {success && (
          <div className="success-message">
            <Icon name="star" size={20} />
            <span>Enrollment successful! Redirecting to login...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <Icon name="error" size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="enroll-form">
          <div className="form-section">
            <h3>👨‍👩‍👧‍👦 Parent Information</h3>
            <div className="form-group">
              <label htmlFor="parentName">Parent Full Name</label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="parentEmail">Parent Email</label>
              <input
                type="email"
                id="parentEmail"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="parentPassword">Password</label>
              <input
                type="password"
                id="parentPassword"
                name="parentPassword"
                value={formData.parentPassword}
                onChange={handleChange}
                required
                placeholder="Create a secure password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
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
          </div>

          <div className="form-section">
            <h3>👶 Child Information</h3>
            <div className="form-group">
              <label htmlFor="childName">Child's Name</label>
              <input
                type="text"
                id="childName"
                name="childName"
                value={formData.childName}
                onChange={handleChange}
                required
                placeholder="Enter your child's name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="childEmail">Child's Email</label>
              <input
                type="email"
                id="childEmail"
                name="childEmail"
                value={formData.childEmail}
                onChange={handleChange}
                required
                placeholder="child.email@example.com"
              />
              <small>This email will be used for your child's learning account</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="childPassword">Child's Password</label>
              <input
                type="password"
                id="childPassword"
                name="childPassword"
                value={formData.childPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Create a simple password for your child"
              />
              <small>Make it easy for your child to remember (at least 6 characters)</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmChildPassword">Confirm Child's Password</label>
              <input
                type="password"
                id="confirmChildPassword"
                name="confirmChildPassword"
                value={formData.confirmChildPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter child's password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="enroll-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="recent" size={20} />
                Enrolling...
              </>
            ) : (
              <>
                <Icon name="star" size={20} />
                Enroll My Child! 🎉
              </>
            )}
          </button>
        </form>

        <div className="enroll-footer">
          <p>Already have an account? <Link to="/login">Parent Login</Link></p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .enroll-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #FFB3BA, #B9FBC0);
            padding: 2rem;
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .enroll-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 25px;
            padding: 3rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
          }

          .enroll-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #FF677D, #F8B400, #B9FBC0);
          }

          .enroll-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .enroll-badge {
            background: linear-gradient(135deg, #FF677D, #F8B400);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
            font-size: 0.9rem;
          }

          .enroll-header h1 {
            color: #2D3748;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .enroll-header p {
            color: #4A5568;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .success-message {
            background: #B9FBC0;
            color: #2D3748;
            padding: 1rem;
            border-radius: 15px;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: bold;
            border: 2px solid #4CAF50;
          }

          .error-message {
            background: #FFB3BA;
            color: #2D3748;
            padding: 1rem;
            border-radius: 15px;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: bold;
            border: 2px solid #FF677D;
          }

          .enroll-form {
            margin-bottom: 2rem;
          }

          .form-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #F8F9FA, #E8F5E8);
            border-radius: 20px;
            border: 2px solid #E2E8F0;
          }

          .form-section h3 {
            color: #2D3748;
            font-size: 1.3rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            color: #2D3748;
            font-weight: bold;
            margin-bottom: 0.5rem;
            font-size: 1rem;
          }

          .form-group input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #E2E8F0;
            border-radius: 15px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
          }

          .form-group input:focus {
            outline: none;
            border-color: #FF677D;
            box-shadow: 0 0 0 3px rgba(255, 103, 125, 0.1);
            transform: translateY(-2px);
          }

          .form-group small {
            color: #4A5568;
            font-size: 0.9rem;
            margin-top: 0.25rem;
            display: block;
          }

          .enroll-btn {
            width: 100%;
            background: linear-gradient(135deg, #FF677D, #F8B400);
            color: white;
            border: none;
            padding: 1.5rem 2rem;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 8px 25px rgba(255, 103, 125, 0.3);
          }

          .enroll-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 103, 125, 0.4);
          }

          .enroll-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .enroll-footer {
            text-align: center;
            color: #4A5568;
          }

          .enroll-footer a {
            color: #FF677D;
            text-decoration: none;
            font-weight: bold;
          }

          .enroll-footer a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .enroll-page {
              padding: 1rem;
            }

            .enroll-container {
              padding: 2rem;
            }

            .enroll-header h1 {
              font-size: 2rem;
            }
          }
        `
      }} />
    </div>
  )
}

export default Enroll
