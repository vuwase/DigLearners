import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../lib/language'
import { useAuth } from '../contexts/AuthContext'
import ProgressTracker from './ProgressTracker'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function TypingLesson({ lesson, onComplete, onProgress }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [currentText, setCurrentText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const inputRef = useRef(null)

  const lessonTexts = [
    "Hello! Welcome to typing practice.",
    "Place your fingers on the home row keys.",
    "A S D F for your left hand.",
    "J K L ; for your right hand.",
    "Keep your fingers curved and relaxed.",
    "Look at the screen, not your keyboard.",
    "Practice makes perfect! Keep going!"
  ]

  useEffect(() => {
    if (lesson?.content) {
      setCurrentText(lesson.content)
    } else {
      setCurrentText(lessonTexts[Math.floor(Math.random() * lessonTexts.length)])
    }
  }, [lesson])

  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now())
    }
  }, [userInput, startTime])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    
    // Check for errors
    let newErrors = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        newErrors++
      }
    }
    setErrors(newErrors)
    
    // Calculate accuracy
    const newAccuracy = value.length > 0 ? Math.max(0, ((value.length - newErrors) / value.length) * 100) : 100
    setAccuracy(newAccuracy)
    
    // Calculate WPM
    if (startTime && value.length > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60 // minutes
      const wordsTyped = value.length / 5 // average word length
      setWpm(Math.round(wordsTyped / timeElapsed))
    }
    
    // Check if lesson is completed
    if (value === currentText) {
      setIsCompleted(true)
      if (onComplete) {
        onComplete({
          wpm,
          accuracy,
          errors,
          timeElapsed: startTime ? (Date.now() - startTime) / 1000 : 0
        })
      }
    }
    
    // Update progress
    if (onProgress) {
      onProgress({
        progress: (value.length / currentText.length) * 100,
        currentChar: value.length,
        totalChars: currentText.length
      })
    }
  }

  const getCharClass = (index) => {
    if (index >= userInput.length) return 'char-pending'
    if (userInput[index] === currentText[index]) return 'char-correct'
    return 'char-incorrect'
  }

  const resetLesson = () => {
    setUserInput('')
    setCurrentIndex(0)
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setIsCompleted(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="typing-lesson">
      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">
              <Icon name="computer" size={24} />
            </div>
            <span className="user-name">Hi, {user?.fullName?.split(' ')[0] || 'Student'}</span>
          </div>
        </div>
      </div>

      {/* Main lesson area */}
      <div className="lesson-content">
        <div className="lesson-info">
          <h2>{lesson?.title || t('lesson.typing_basics')}</h2>
          
          {/* Enhanced progress tracking */}
          <ProgressTracker 
            currentProgress={Math.round((userInput.length / currentText.length) * 100)}
            totalItems={100}
            showStats={true}
            showLevel={true}
          />
          
          <div className="lesson-stats">
            <div className="stat">
              <span className="stat-label">WPM:</span>
              <span className="stat-value">{wpm}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{Math.round(accuracy)}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Errors:</span>
              <span className="stat-value">{errors}</span>
            </div>
          </div>
        </div>

      <div className="typing-area">
        <div className="text-display">
          {currentText.split('').map((char, index) => (
            <span
              key={index}
              className={`char ${getCharClass(index)}`}
            >
              {char}
            </span>
          ))}
        </div>
        
        <div className="input-area">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="typing-input"
            placeholder="Start typing here..."
            disabled={isCompleted}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>

      <div className="lesson-controls">
        <button onClick={resetLesson} className="reset-button">
          <Icon name="recent" size={16} style={{ marginRight: '8px' }} />
          {t('common.restart')}
        </button>
        
        {isCompleted && (
          <div className="completion-message">
            <h3>
              <Icon name="star" size={20} style={{ marginRight: '8px' }} />
              {t('lesson.lesson_complete')}
            </h3>
            <p>Great job! You typed at {wpm} WPM with {Math.round(accuracy)}% accuracy!</p>
            <button onClick={() => onComplete && onComplete({ wpm, accuracy, errors })} className="next-button">
              {t('common.next')} →
            </button>
          </div>
        )}
      </div>

      <div className="typing-tips">
        <h4>
          <Icon name="help" size={16} style={{ marginRight: '8px' }} />
          Typing Tips:
        </h4>
        <ul>
          <li>Keep your fingers on the home row</li>
          <li>Look at the screen, not the keyboard</li>
          <li>Type smoothly and rhythmically</li>
          <li>Don't worry about speed - accuracy first!</li>
        </ul>
      </div>
      </div>
    </div>
  )
}
