import React, { useState } from 'react'
import { useTranslation } from '../lib/language'
import { useAuth } from '../contexts/AuthContext'
import { useSound } from '../lib/soundEffects'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function SafeBrowsingLesson({ lesson, onComplete, onProgress }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { playNextButton, playClick } = useSound()
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const scenarios = [
    {
      id: 1,
      question: "You receive an email saying 'Click here to win $1000!' What should you do?",
      options: [
        "Click the link immediately",
        "Delete the email without clicking",
        "Forward it to all your friends",
        "Reply asking for more details"
      ],
      correct: 1,
      explanation: "Never click suspicious links! This is likely a scam trying to trick you."
    },
    {
      id: 2,
      question: "A website asks for your password. What should you do?",
      options: [
        "Give them your password",
        "Check if it's a trusted website first",
        "Use a fake password",
        "Ask your friends what to do"
      ],
      correct: 1,
      explanation: "Only enter passwords on websites you trust. Look for the lock icon in your browser."
    },
    {
      id: 3,
      question: "Someone online asks for your personal information. What should you do?",
      options: [
        "Tell them everything they want",
        "Never share personal information with strangers",
        "Ask them to prove who they are first",
        "Only share your name and age"
      ],
      correct: 1,
      explanation: "Never share personal information like your address, phone number, or school with strangers online."
    },
    {
      id: 4,
      question: "You see a pop-up saying 'Your computer is infected! Click here to fix it!' What should you do?",
      options: [
        "Click the pop-up immediately",
        "Close the pop-up and ignore it",
        "Call your parents or teacher",
        "Both B and C"
      ],
      correct: 3,
      explanation: "Pop-ups like this are usually fake. Close them and tell a trusted adult if you're worried."
    },
    {
      id: 5,
      question: "A friend sends you a link to a cool game. What should you do?",
      options: [
        "Click it right away",
        "Ask your friend what the link is first",
        "Never click links from friends",
        "Click it but don't enter any information"
      ],
      correct: 1,
      explanation: "It's okay to click links from friends, but always ask what it is first to be safe."
    }
  ]

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === scenarios[currentScenario].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    playNextButton()
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsCompleted(true)
      if (onComplete) {
        onComplete({
          score,
          totalQuestions: scenarios.length,
          percentage: Math.round((score / scenarios.length) * 100)
        })
      }
    }
    
    if (onProgress) {
      onProgress({
        progress: ((currentScenario + 1) / scenarios.length) * 100,
        currentQuestion: currentScenario + 1,
        totalQuestions: scenarios.length
      })
    }
  }

  const resetLesson = () => {
    setCurrentScenario(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setIsCompleted(false)
  }

  const currentScenarioData = scenarios[currentScenario]

  return (
    <div className="safe-browsing-lesson">
      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">
              <Icon name="shield" size={24} />
            </div>
            <span className="user-name">Hi, {user?.fullName?.split(' ')[0] || 'Student'}</span>
          </div>
        </div>
      </div>

      {/* Main lesson area */}
      <div className="lesson-content">
        <div className="lesson-info">
          <h2>{lesson?.title || t('lesson.safe_browsing')}</h2>
          <div className="lesson-progress">
            <span>Question {currentScenario + 1} of {scenarios.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

      <div className="scenario-area">
        <div className="scenario-card">
          <div className="scenario-icon">
            <Icon name="shield" size={32} />
          </div>
          <h3 className="scenario-question">{currentScenarioData.question}</h3>
          
          <div className="options-grid">
            {currentScenarioData.options.map((option, index) => {
              let optionClass = 'option-button'
              if (showResult) {
                if (index === currentScenarioData.correct) {
                  optionClass += ' correct'
                } else if (index === selectedAnswer && index !== currentScenarioData.correct) {
                  optionClass += ' incorrect'
                }
              }
              
              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className="result-explanation">
              <div className={`result-icon ${selectedAnswer === currentScenarioData.correct ? 'correct' : 'incorrect'}`}>
                <Icon 
                  name={selectedAnswer === currentScenarioData.correct ? 'check' : 'cross'} 
                  size={24} 
                />
              </div>
              <div className="explanation-text">
                <h4>
                  {selectedAnswer === currentScenarioData.correct ? 'Correct!' : 'Not quite right.'}
                </h4>
                <p>{currentScenarioData.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lesson-controls">
        {showResult && !isCompleted && (
          <button onClick={handleNext} className="next-button">
            {currentScenario < scenarios.length - 1 ? t('common.next') : t('common.finish')} →
          </button>
        )}
        
        <button onClick={resetLesson} className="reset-button">
          <Icon name="recent" size={16} style={{ marginRight: '8px' }} />
          {t('common.restart')}
        </button>
      </div>

      {isCompleted && (
        <div className="completion-message">
          <h3>
            <Icon name="star" size={20} style={{ marginRight: '8px' }} />
            {t('lesson.lesson_complete')}
          </h3>
          <div className="final-score">
            <p>You scored {score} out of {scenarios.length} questions!</p>
            <p>That's {Math.round((score / scenarios.length) * 100)}% correct!</p>
          </div>
          <button onClick={() => onComplete && onComplete({ score, totalQuestions: scenarios.length })} className="next-button">
            <Icon name="achievement" size={16} style={{ marginRight: '8px' }} />
            {t('common.finish')}
          </button>
        </div>
      )}

      <div className="safety-tips">
        <h4>
          <Icon name="shield" size={20} style={{ marginRight: '8px' }} />
          Internet Safety Tips:
        </h4>
        <ul>
          <li>Never share personal information with strangers</li>
          <li>Don't click on suspicious links or pop-ups</li>
          <li>Always ask a trusted adult if you're unsure</li>
          <li>Use strong passwords and keep them private</li>
          <li>Be kind and respectful online</li>
        </ul>
      </div>
      </div>
    </div>
  )
}
