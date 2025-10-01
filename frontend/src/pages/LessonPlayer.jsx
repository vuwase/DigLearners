import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from '../lib/language'
import { gamificationManager } from '../lib/gamification'
import MyComponent from '../components/MyComponent'
import TypingLesson from '../components/TypingLesson'
import SafeBrowsingLesson from '../components/SafeBrowsingLesson'
import BlockCodingLesson from '../components/BlockCodingLesson'
import { fetchLessonById, saveProgress } from '../lib/api'

export default function LessonPlayer() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    try {
      const lessonData = await fetchLessonById(id)
      setLesson(lessonData)
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = async (results) => {
    try {
      // Save progress to local storage
      await saveProgress({
        lessonId: lesson.id,
        score: results.score || results.accuracy || 100,
        completedAt: new Date().toISOString(),
        results: results
      })

      // Update gamification
      const userId = 'demo-student-1' // In real app, get from auth
      const activityType = getActivityType(lesson.moduleType)
      await gamificationManager.updateProgress(userId, {
        type: activityType,
        points: calculatePoints(results)
      })

      setIsCompleted(true)
    } catch (error) {
      console.error('Error saving progress:', error)
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
    navigate('/lessons')
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
      <MyComponent title={t('common.loading')} subtitle={t('common.loading')}>
        <div className="loading">{t('common.loading')}</div>
      </MyComponent>
    )
  }

  if (!lesson) {
    return (
      <MyComponent title={t('common.error')} subtitle="Lesson not found">
        <div className="error">Lesson not found. Please try again.</div>
        <button onClick={handleBackToLessons} className="back-button">
          ← {t('common.back')} to {t('nav.lessons')}
        </button>
      </MyComponent>
    )
  }

  return (
    <MyComponent title={lesson.title} subtitle={`${lesson.moduleType} • ${Math.round(progress)}% complete`}>
      {isCompleted && (
        <div className="completion-banner">
          <h3>🎉 {t('lesson.congratulations')}</h3>
          <p>You've completed this lesson! Great job!</p>
          <div className="completion-actions">
            <button onClick={handleBackToLessons} className="back-button">
              ← {t('common.back')} to {t('nav.lessons')}
            </button>
          </div>
        </div>
      )}
      
      {!isCompleted && (
        <>
          {renderLessonComponent()}
          
          <div className="lesson-progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(progress)}% complete</span>
          </div>
        </>
      )}
    </MyComponent>
  )
}
