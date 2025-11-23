import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'
import { gamificationManager } from '../lib/gamification'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function ProgressTracker({ 
  currentProgress = 0, 
  totalItems = 100, 
  showStats = true,
  showLevel = true,
  userId = 'demo-student-1'
}) {
  const { t } = useTranslation()
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProgress()
  }, [userId])

  const loadUserProgress = async () => {
    try {
      const progress = await gamificationManager.getUserProgress(userId)
      setUserProgress(progress)
    } catch (error) {
      console.error('Error loading user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = Math.round((currentProgress / totalItems) * 100)

  if (loading) {
    return (
      <div className="progress-tracker">
        <div className="loading">Loading progress...</div>
      </div>
    )
  }

  return (
    <div className="progress-tracker">
      {/* Main progress bar */}
      <div className="main-progress">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">{progressPercentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {currentProgress} of {totalItems} completed
          </div>
        </div>
      </div>

      {/* User stats */}
      {showStats && userProgress && (
        <div className="user-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <Icon name="achievement" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.totalPoints}</div>
              <div className="stat-label">Points</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Icon name="lightning" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Icon name="target" size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userProgress.lessonsCompleted}</div>
              <div className="stat-label">Lessons</div>
            </div>
          </div>
        </div>
      )}

      {/* Level display */}
      {showLevel && userProgress && (
        <div className="level-display">
          <div className="level-badge">
            <div className="level-number">{userProgress.level}</div>
            <div className="level-text">Level</div>
          </div>
          <div className="level-progress">
            <div className="level-bar">
              <div 
                className="level-fill"
                style={{ width: `${(userProgress.totalPoints % 100)}%` }}
              ></div>
            </div>
            <div className="level-points">
              {userProgress.totalPoints % 100}/100 XP
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
