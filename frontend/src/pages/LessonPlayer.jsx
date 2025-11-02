import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import learnerApiService from '../services/learnerApiService'
import TypingLesson from '../components/TypingLesson'
import SafeBrowsingLesson from '../components/SafeBrowsingLesson'
import BlockCodingLesson from '../components/BlockCodingLesson'

export default function LessonPlayer() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('[LessonPlayer] Loading lesson:', id)
      
      const response = await learnerApiService.getLessonContent(id)
      console.log('[LessonPlayer] Lesson data:', response)
      
      // Handle different response formats
      const lessonData = response.lesson || response.data?.lesson || response
      setLesson(lessonData)
    } catch (error) {
      console.error('[LessonPlayer] Error loading lesson:', error)
      setError(error.message || 'Failed to load lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = async (results) => {
    try {
      console.log('[LessonPlayer] Lesson completed:', results)
      
      // Save progress to backend and award badges
      if (lesson?.id) {
        const score = results.score || results.accuracy || 100
        const progressPercentage = 100
        
        // Use the progress endpoint which will check for and award badges
        const response = await learnerApiService.updateProgress(lesson.id, {
          score: score,
          timeSpent: results.timeSpent || 0,
          progressPercentage: progressPercentage,
          isCompleted: true
        }).catch(err => {
          console.warn('[LessonPlayer] Failed to save progress to backend:', err)
          return null
        })
        
        // Show badges if any were awarded
        const newBadges = response?.newBadges || response?.data?.newBadges || []
        if (newBadges.length > 0) {
          console.log('[LessonPlayer] Badges awarded:', newBadges)
          // Store new badges to show notification
          localStorage.setItem('newBadges', JSON.stringify(newBadges))
          // Trigger dashboard refresh on next visit
          localStorage.setItem('refreshDashboard', 'true')
        }
      }

      setIsCompleted(true)
    } catch (error) {
      console.error('[LessonPlayer] Error saving progress:', error)
      // Still mark as completed even if API call fails
      setIsCompleted(true)
    }
  }

  const handleProgress = (progressData) => {
    setProgress(progressData.progress)
  }

  const getActivityType = (moduleType) => {
    switch (moduleType) {
      case 'typing': return 'typing_lesson'
      case 'safety': return 'safety_lesson'
      case 'coding': return 'coding_puzzle'
      default: return 'lesson_completed'
    }
  }

  const calculatePoints = (results) => {
    if (results.wpm && results.accuracy) {
      return Math.round((results.wpm * results.accuracy) / 10)
    }
    if (results.percentage) {
      return Math.round(results.percentage / 2)
    }
    return 20
  }

  const handleBackToLessons = () => {
    navigate('/dashboard/lessons')
  }

  const renderLessonComponent = () => {
    if (!lesson) return null

    switch (lesson.moduleType) {
      case 'typing':
        return (
          <TypingLesson
            lesson={lesson}
            onComplete={handleLessonComplete}
            onProgress={handleProgress}
          />
        )
      case 'safety':
        return (
          <SafeBrowsingLesson
            lesson={lesson}
            onComplete={handleLessonComplete}
            onProgress={handleProgress}
          />
        )
      case 'coding':
        return (
          <BlockCodingLesson
            lesson={lesson}
            onComplete={handleLessonComplete}
            onProgress={handleProgress}
          />
        )
      default:
        return (
          <div className="basic-lesson">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            <div className="lesson-controls">
              <button onClick={() => handleLessonComplete({ score: 100 })} className="complete-button">
                {t('lesson.lesson_complete')}
              </button>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="lesson-player-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('common.loading') || 'Loading lesson...'}</p>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="lesson-player-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>{t('common.error') || 'Error'}</h3>
          <p>{error || 'Lesson not found. Please try again.'}</p>
          <button onClick={handleBackToLessons} className="back-button">
            ← {t('common.back') || 'Back'} to {t('nav.lessons') || 'Lessons'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-player-container">
      <div className="lesson-header">
        <button onClick={handleBackToLessons} className="back-button-header">
          ← {t('common.back') || 'Back'}
        </button>
        <div className="lesson-title-section">
          <h1>{lesson.title || 'Lesson'}</h1>
          <p className="lesson-subtitle">
            {lesson.moduleType || lesson.subject} • {Math.round(progress)}% {t('common.complete') || 'complete'}
          </p>
        </div>
      </div>

      {isCompleted && (
        <div className="completion-banner">
          <div className="completion-icon">🌟</div>
          <h3>{t('lesson.congratulations') || 'Congratulations!'}</h3>
          <p>{t('lesson.completedMessage') || 'You\'ve completed this lesson! Great job!'}</p>
          <div className="completion-actions">
            <button onClick={handleBackToLessons} className="back-button">
              ← {t('common.back') || 'Back'} to {t('nav.lessons') || 'Lessons'}
            </button>
          </div>
        </div>
      )}
      
      {!isCompleted && (
        <>
          <div className="lesson-content">
            {renderLessonComponent()}
          </div>
          
          <div className="lesson-progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(progress)}% {t('common.complete') || 'complete'}</span>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .lesson-player-container {
            min-height: calc(100vh - 140px);
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Comic Sans MS', cursive, sans-serif;
          }

          .lesson-header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .back-button-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 15px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .back-button-header:hover {
            transform: translateX(-3px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .lesson-title-section h1 {
            margin: 0;
            color: #2D3748;
            font-size: 2rem;
          }

          .lesson-subtitle {
            margin: 0.5rem 0 0 0;
            color: #64748b;
            font-size: 0.9rem;
          }

          .lesson-content {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .lesson-progress-indicator {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .progress-bar {
            flex: 1;
            height: 12px;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #22c55e, #16a34a);
            transition: width 0.3s ease;
            border-radius: 10px;
          }

          .progress-text {
            color: #2D3748;
            font-weight: bold;
            font-size: 0.9rem;
          }

          .completion-banner {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .completion-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .completion-banner h3 {
            color: #2D3748;
            font-size: 2rem;
            margin: 0 0 1rem 0;
          }

          .completion-banner p {
            color: #4A5568;
            font-size: 1.2rem;
            margin: 0 0 2rem 0;
          }

          .back-button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 15px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .loading-state,
          .error-state {
            text-align: center;
            padding: 4rem 2rem;
            color: white;
          }

          .spinner {
            width: 60px;
            height: 60px;
            border: 6px solid rgba(255,255,255,0.3);
            border-top: 6px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .error-state h3 {
            font-size: 2rem;
            margin: 0 0 1rem 0;
          }

          .error-state p {
            font-size: 1.2rem;
            margin: 0 0 2rem 0;
          }

          @media (max-width: 768px) {
            .lesson-player-container {
              padding: 1rem;
            }

            .lesson-header {
              flex-direction: column;
              align-items: flex-start;
            }

            .lesson-title-section h1 {
              font-size: 1.5rem;
            }

            .lesson-content {
              padding: 1.5rem;
            }
          }
        `
      }} />
    </div>
  )
}
