// Student Enrollment Page - Kid-Friendly Design
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
    childName: '',
    childEmail: '',
    childPassword: '',
    confirmChildPassword: '',
    grade: '',
    age: ''
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

    if (formData.childPassword !== formData.confirmChildPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.childPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!formData.grade) {
      setError('Please select a grade')
      setLoading(false)
      return
    }

    if (!formData.age || formData.age < 3 || formData.age > 18) {
      setError('Please enter a valid age (3-18)')
      setLoading(false)
      return
    }

    try {
      const result = await register({
        fullName: formData.childName,
        email: formData.childEmail,
        password: formData.childPassword,
        role: 'learner',
        grade: formData.grade,
        age: parseInt(formData.age)
      })

      if (!result.success) {
        setError(result.error || 'Registration failed')
      } else {
        setSuccess({
          registrationCode: result.registrationCode,
          message: result.message
        })
        setTimeout(() => {
          navigate('/login?type=student')
        }, 4000)
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
            <span>STUDENT REGISTRATION</span>
          </div>
          <h1>Student Registration 🎓</h1>
          <p>Create your student account to start your digital learning journey!</p>
        </div>

        {success && (
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <div className="success-content">
              <div className="success-title">🌟 Welcome to DigLearners! 🌟</div>
              <div className="success-text">
                Congratulations! Your student account has been created successfully. You're now ready to start your amazing digital learning adventure with fun games, interactive lessons, and exciting challenges!
              </div>
              <div className="success-code">
                <strong>Your Registration Code: <span className="code-highlight">{success.registrationCode || 'ABC123'}</span></strong>
              </div>
              <div className="success-action">
                Taking you to the login page to start learning...
              </div>
              <div className="success-progress">
                <div className="progress-bar"></div>
              </div>
            </div>
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
            <h3>👨‍🎓 Student Information</h3>
            <div className="form-group">
              <label htmlFor="childName">Full Name</label>
              <input
                type="text"
                id="childName"
                name="childName"
                value={formData.childName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="childEmail">Email Address</label>
              <input
                type="email"
                id="childEmail"
                name="childEmail"
                value={formData.childEmail}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
              <small>This email will be used for your learning account</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="grade">Grade</label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="3"
                  max="18"
                  placeholder="Age"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="childPassword">Password</label>
              <input
                type="password"
                id="childPassword"
                name="childPassword"
                value={formData.childPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Create a password"
              />
              <small>At least 6 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmChildPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmChildPassword"
                name="confirmChildPassword"
                value={formData.confirmChildPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`enroll-btn ${success ? 'success' : ''}`}
            disabled={loading || success}
          >
            {success ? (
              <>
                <span>✅</span>
                Registration Successful!
              </>
            ) : loading ? (
              <>
                <Icon name="recent" size={20} />
                Registering...
              </>
            ) : (
              <>
                <Icon name="star" size={20} />
                Register Now! 🎉
              </>
            )}
          </button>
        </form>

        <div className="enroll-footer">
          <p>Already have an account? <Link to="/login">Student Login</Link></p>
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

          .enroll-header {
            text-align: center;
            margin-bottom: 2rem;
            position: relative;
            z-index: 1;
          }

          .enroll-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #FF677D, #F8B400);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
            box-shadow: 0 4px 15px rgba(255, 103, 125, 0.3);
          }

          .enroll-header h1 {
            color: #FF677D;
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .enroll-header p {
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

          .success-code {
            background: rgba(16, 185, 129, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }

          .code-highlight {
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            color: #047857;
            background: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            letter-spacing: 0.1em;
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
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { 
              transform: translateY(0); 
            }
            40% { 
              transform: translateY(-10px); 
            }
            60% { 
              transform: translateY(-5px); 
            }
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

          .error-message {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
          }

          .enroll-form {
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

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
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

          .form-group input, .form-group select {
            width: 100%;
            padding: 0.875rem;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #FF677D;
            box-shadow: 0 0 0 3px rgba(255, 103, 125, 0.1);
            transform: translateY(-2px);
          }

          .form-group small {
            display: block;
            margin-top: 0.5rem;
            color: #6b7280;
            font-size: 0.85rem;
          }

          .enroll-btn {
            width: 100%;
            background: linear-gradient(135deg, #FF677D, #F8B400);
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
            box-shadow: 0 8px 25px rgba(255, 103, 125, 0.3);
          }

          .enroll-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 103, 125, 0.4);
          }

          .enroll-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .enroll-btn.success {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            transform: scale(1.02) !important;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
          }

          .enroll-footer {
            text-align: center;
            margin-top: 2rem;
            position: relative;
            z-index: 1;
          }

          .enroll-footer p {
            color: #6b7280;
            margin: 0;
          }

          .enroll-footer a {
            color: #FF677D;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
          }

          .enroll-footer a:hover {
            color: #F8B400;
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .enroll-container {
              margin: 1rem;
              padding: 2rem;
            }

            .enroll-header h1 {
              font-size: 2rem;
            }

            .form-row {
              grid-template-columns: 1fr;
            }
          }
        `
      }} />
    </div>
  )
}

export default Enroll