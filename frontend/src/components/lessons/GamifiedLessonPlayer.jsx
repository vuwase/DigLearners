// Gamified Lesson Player - Handles all gamified lesson types
import React, { useState, useEffect } from 'react'
import TypingAdventure from './TypingAdventure'
import SafeInternetExplorer from './SafeInternetExplorer'
import CodeQuest from './CodeQuest'
import { gamifiedLessons, getLessonById } from '../../data/gamifiedLessons'
import './GamifiedLessonPlayer.css'

const GamifiedLessonPlayer = ({ lessonId, onComplete, onProgress, onExit }) => {
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showIntro, setShowIntro] = useState(true)
  const [lessonProgress, setLessonProgress] = useState({
    currentStep: 0,
    totalSteps: 0,
    score: 0,
    accuracy: 0,
    timeSpent: 0
  })

  useEffect(() => {
    const loadLesson = () => {
      try {
        const lessonData = getLessonById(lessonId)
        if (!lessonData) {
          setError('Lesson not found')
          return
        }
        setLesson(lessonData)
        setLoading(false)
      } catch (err) {
        setError('Failed to load lesson')
        setLoading(false)
      }
    }

    loadLesson()
  }, [lessonId])

  const handleLessonComplete = (results) => {
    const completionData = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      completedAt: new Date().toISOString(),
      results: {
        score: results.score || 0,
        accuracy: results.accuracy || 0,
        timeSpent: results.timeSpent || 0,
        level: results.level || 1,
        badges: results.badges || [],
        achievements: results.achievements || [],
        ...results
      }
    }

    onComplete(completionData)
  }

  const handleLessonProgress = (progress) => {
    setLessonProgress(prev => ({
      ...prev,
      ...progress,
      timeSpent: Date.now() - (progress.startTime || Date.now())
    }))
    
    onProgress(progress)
  }

  const startLesson = () => {
    setShowIntro(false)
  }

  const renderLessonComponent = () => {
    if (!lesson) return null

    switch (lesson.component) {
      case 'TypingAdventure':
        return (
          <TypingAdventure
            onComplete={handleLessonComplete}
            onProgress={handleLessonProgress}
          />
        )
      case 'SafeInternetExplorer':
        return (
          <SafeInternetExplorer
            onComplete={handleLessonComplete}
            onProgress={handleLessonProgress}
          />
        )
      case 'CodeQuest':
        return (
          <CodeQuest
            onComplete={handleLessonComplete}
            onProgress={handleLessonProgress}
          />
        )
      default:
        return <div className="lesson-error">Lesson component not found</div>
    }
  }

  if (loading) {
    return (
      <div className="gamified-lesson-player">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>Loading Lesson...</h2>
          <p>Preparing your learning adventure!</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gamified-lesson-player">
        <div className="error-screen">
          <div className="error-icon">❌</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={onExit}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (showIntro) {
    return (
      <div className="gamified-lesson-player">
        <div className="lesson-intro">
          <div className="intro-content">
            <div className="lesson-icon">{lesson.icon}</div>
            <h1>{lesson.title}</h1>
            <p className="lesson-description">{lesson.description}</p>
            
            <div className="lesson-info">
              <div className="info-item">
                <span className="info-label">Duration:</span>
                <span className="info-value">{lesson.duration}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Difficulty:</span>
                <span className="info-value">{lesson.difficulty}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Age Group:</span>
                <span className="info-value">{lesson.ageGroup}</span>
              </div>
            </div>

            <div className="learning-objectives">
              <h3>What you'll learn:</h3>
              <ul>
                {lesson.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>

            <div className="lesson-features">
              <h3>Features:</h3>
              <div className="features-grid">
                {lesson.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon">✨</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="intro-actions">
              <button className="btn-start" onClick={startLesson}>
                🚀 Start Adventure
              </button>
              <button className="btn-exit" onClick={onExit}>
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gamified-lesson-player">
      {renderLessonComponent()}
    </div>
  )
}

export default GamifiedLessonPlayer
