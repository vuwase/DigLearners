import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'
import { useSound } from '../lib/soundEffects'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function AchievementNotification({ 
  badge, 
  points, 
  isVisible, 
  onClose,
  duration = 5000 
}) {
  const { t } = useTranslation()
  const { playBadgeWin, playCelebration } = useSound()
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    setShow(isVisible)
    
    if (isVisible) {
      // Play funny badge win sound immediately!
      playBadgeWin()
      // Play celebration sound after a short delay
      setTimeout(() => playCelebration(), 500)
      
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(() => onClose && onClose(), 300)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose, playBadgeWin, playCelebration])

  if (!show) return null

  return (
    <div className={`achievement-notification ${show ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="achievement-icon">
          <div className="badge-icon">
            <Icon name="achievement" size={32} />
          </div>
          <div className="sparkle-effect">✨</div>
        </div>
        
        <div className="achievement-text">
          <div className="achievement-title">
            {badge?.name || 'Achievement Unlocked!'}
          </div>
          <div className="achievement-description">
            {badge?.description || 'You earned a new badge!'}
          </div>
          {points && (
            <div className="points-earned">
              +{points} points
            </div>
          )}
        </div>
        
        <button 
          className="close-notification"
          onClick={() => {
            setShow(false)
            setTimeout(() => onClose && onClose(), 300)
          }}
        >
          ×
        </button>
      </div>
      
      <div className="notification-progress">
        <div className="progress-fill"></div>
      </div>
    </div>
  )
}
