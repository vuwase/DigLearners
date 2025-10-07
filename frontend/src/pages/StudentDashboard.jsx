import React, { useState, useEffect } from 'react'
import { gamificationManager, LEVELS } from '../lib/gamification'
import { useTranslation } from '../lib/language'
import MyComponent from '../components/MyComponent'
import Icon from '../components/icons/Icon'

export default function StudentDashboard() {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newBadges, setNewBadges] = useState([])

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      // For demo purposes, using a fixed userId
      // In real app, this would come from authentication
      const userId = 'demo-student-1'
      const userProgress = await gamificationManager.getUserProgress(userId)
      setProgress(userProgress)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateActivity = async (activityType) => {
    try {
      const userId = 'demo-student-1'
      const result = await gamificationManager.updateProgress(userId, {
        type: activityType,
        points: Math.floor(Math.random() * 20) + 10
      })
      setProgress(result.progress)
      if (result.newBadges.length > 0) {
        setNewBadges(result.newBadges)
        // Clear new badges after 3 seconds
        setTimeout(() => setNewBadges([]), 3000)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading) {
    return (
      <MyComponent title={t('nav.student')} subtitle={t('common.loading')}>
        <div className="loading">{t('common.loading')}</div>
      </MyComponent>
    )
  }

  if (!progress) {
    return (
      <MyComponent title={t('nav.student')} subtitle={t('common.error')}>
        <div className="error">{t('error.loading_progress')}</div>
      </MyComponent>
    )
  }

  const currentLevel = gamificationManager.getLevelInfo(progress.level)
  const nextLevel = gamificationManager.getNextLevelInfo(progress.level)
  const levelProgress = gamificationManager.getProgressToNextLevel(progress.totalPoints, progress.level)

  return (
    <MyComponent title={t('nav.student')} subtitle={`${t('student.welcome')}, ${t(`level.${currentLevel.name.toLowerCase().replace(/\s+/g, '_')}`)}!`}>
      {/* New Badges Notification */}
      {newBadges.length > 0 && (
        <div className="badge-notification">
          <h3>
            <Icon name="star" size={20} style={{ marginRight: '8px' }} />
            {t('student.new_badges')}
          </h3>
          {newBadges.map(badge => (
            <div key={badge.id} className="new-badge">
              <span className="badge-icon">{badge.icon}</span>
              <div>
                <strong>{t(`badge.${badge.id}`)}</strong>
                <p>{t(`badge.${badge.id}_desc`)}</p>
                <span className="points">+{badge.points} {t('common.points')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level Progress */}
      <div className="level-progress">
        <h3>{t('student.level_progress')}</h3>
        <div className="level-info">
          <div className="current-level">
            <span className="level-number">{progress.level}</span>
            <span className="level-name">{currentLevel.name}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${levelProgress.progress}%`,
                backgroundColor: currentLevel.color 
              }}
            ></div>
          </div>
          <div className="points-info">
            <span>{progress.totalPoints} points</span>
            {nextLevel && (
              <span>{levelProgress.pointsNeeded} to next level</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="book" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{progress.lessonsCompleted}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="achievement" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{progress.badges.length}</div>
            <div className="stat-label">Badges Earned</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="star" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{progress.totalPoints}</div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="lightning" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{progress.streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="recent-badges">
        <h3>Recent Badges</h3>
        <div className="badges-list">
          {progress.badges.slice(-3).map(badgeId => {
            const badge = Object.values(LEVELS).find(b => b.id === badgeId)
            return badge ? (
              <div key={badgeId} className="badge-item">
                <span className="badge-icon">{badge.icon}</span>
                <div>
                  <strong>{badge.name}</strong>
                  <p>{badge.description}</p>
                </div>
              </div>
            ) : null
          })}
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="demo-actions">
        <h3>Demo Actions</h3>
        <div className="demo-buttons">
          <button onClick={() => simulateActivity('lesson_completed')}>
            Complete Lesson (+10-30 pts)
          </button>
          <button onClick={() => simulateActivity('typing_lesson')}>
            Typing Lesson (+15-35 pts)
          </button>
          <button onClick={() => simulateActivity('coding_puzzle')}>
            Coding Puzzle (+25-45 pts)
          </button>
          <button onClick={() => simulateActivity('perfect_score')}>
            Perfect Score (+30-50 pts)
          </button>
        </div>
      </div>
    </MyComponent>
  )
}
