// Notification System for Kids
import React, { useState, useEffect, createContext, useContext } from 'react'
import { useSound } from '../../lib/soundEffects'
import './NotificationSystem.css'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const { playSuccess, playError } = useSound()

  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: notification.type || 'info',
      message: notification.message,
      title: notification.title,
      duration: notification.duration || 5000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Play sound based on type
    if (newNotification.type === 'success') {
      playSuccess()
    } else if (newNotification.type === 'error') {
      playError()
    }

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

const Notification = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false)

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300)
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      case 'achievement':
        return '🏆'
      default:
        return '📢'
    }
  }

  const getColor = () => {
    switch (notification.type) {
      case 'success':
        return '#10b981'
      case 'error':
        return '#ef4444'
      case 'warning':
        return '#f59e0b'
      case 'info':
        return '#3b82f6'
      case 'achievement':
        return '#f97316'
      default:
        return '#6b7280'
    }
  }

  return (
    <div
      className={`notification ${notification.type} ${isExiting ? 'exiting' : ''}`}
      style={{ borderLeftColor: getColor() }}
    >
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        {notification.title && (
          <div className="notification-title">{notification.title}</div>
        )}
        <div className="notification-message">{notification.message}</div>
      </div>
      <button
        className="notification-close"
        onClick={handleRemove}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export default NotificationProvider

