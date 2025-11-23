// Typing Adventure - Gamified Typing Lesson for Kids
import React, { useState, useEffect, useRef } from 'react'
import './TypingAdventure.css'

const TypingAdventure = ({ onComplete, onProgress }) => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentWord, setCurrentWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState('playing') // playing, paused, completed, gameOver
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  
  const inputRef = useRef(null)
  const intervalRef = useRef(null)

  // Adventure-themed word lists for different levels
  const adventureWords = {
    1: ['cat', 'dog', 'sun', 'moon', 'star', 'tree', 'bird', 'fish', 'car', 'bus'],
    2: ['castle', 'dragon', 'princess', 'knight', 'sword', 'shield', 'treasure', 'magic', 'forest', 'mountain'],
    3: ['adventure', 'explorer', 'journey', 'discovery', 'mystery', 'courage', 'friendship', 'victory', 'challenge', 'success']
  }

  // Power-ups and special effects
  const powerUps = [
    { name: 'Time Boost', icon: '⏰', effect: 'Add 10 seconds', duration: 10000 },
    { name: 'Life Saver', icon: '❤️', effect: 'Restore 1 life', duration: 0 },
    { name: 'Score Multiplier', icon: '⭐', effect: '2x points for 15 seconds', duration: 15000 },
    { name: 'Slow Motion', icon: '🐌', effect: 'Slow down time', duration: 20000 }
  ]

  const [activePowerUps, setActivePowerUps] = useState([])
  const [showPowerUp, setShowPowerUp] = useState(null)

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameOver')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [gameState, timeLeft])

  useEffect(() => {
    if (gameState === 'playing') {
      generateNewWord()
    }
  }, [currentLevel, gameState])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentWord])

  const generateNewWord = () => {
    const words = adventureWords[currentLevel] || adventureWords[1]
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(randomWord)
    setUserInput('')
    setCurrentCharacter(0)
  }

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase()
    setUserInput(value)
    setTotalChars(prev => prev + 1)

    // Check if current character is correct
    if (value === currentWord.slice(0, value.length)) {
      setCorrectChars(prev => prev + 1)
      setCurrentCharacter(value.length)
      
      // Check if word is complete
      if (value === currentWord) {
        handleWordComplete()
      }
    } else {
      // Wrong character - lose life
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          setGameState('gameOver')
        }
        return newLives
      })
      setStreak(0)
    }
  }

  const handleWordComplete = () => {
    const wordScore = currentWord.length * (streak + 1) * 10
    setScore(prev => prev + wordScore)
    setStreak(prev => prev + 1)
    
    // Check for level up
    if (streak >= 5 && currentLevel < 3) {
      setCurrentLevel(prev => prev + 1)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }

    // Random power-up chance
    if (Math.random() < 0.3) {
      const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)]
      setShowPowerUp(randomPowerUp)
      setTimeout(() => setShowPowerUp(null), 3000)
    }

    generateNewWord()
  }

  const activatePowerUp = (powerUp) => {
    setActivePowerUps(prev => [...prev, { ...powerUp, id: Date.now() }])
    
    switch (powerUp.name) {
      case 'Time Boost':
        setTimeLeft(prev => prev + 10)
        break
      case 'Life Saver':
        setLives(prev => Math.min(prev + 1, 3))
        break
      case 'Score Multiplier':
        // This would be handled in scoring logic
        break
      case 'Slow Motion':
        // This would slow down the timer
        break
    }
  }

  const calculateWPM = () => {
    const minutes = (60 - timeLeft) / 60
    return minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0
  }

  const calculateAccuracy = () => {
    return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
  }

  useEffect(() => {
    setWpm(calculateWPM())
    setAccuracy(calculateAccuracy())
  }, [correctChars, totalChars, timeLeft])

  const handleComplete = () => {
    const finalScore = score + (timeLeft * 10) + (lives * 100)
    const finalWPM = calculateWPM()
    const finalAccuracy = calculateAccuracy()
    
    onComplete({
      score: finalScore,
      wpm: finalWPM,
      accuracy: finalAccuracy,
      level: currentLevel,
      wordsTyped: Math.floor(correctChars / 5)
    })
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setScore(0)
    setLives(3)
    setStreak(0)
    setTimeLeft(60)
    setGameState('playing')
    setCorrectChars(0)
    setTotalChars(0)
    setUserInput('')
    setCurrentCharacter(0)
    setActivePowerUps([])
  }

  if (gameState === 'gameOver') {
    return (
      <div className="typing-adventure">
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>🏰 Adventure Complete! 🏰</h2>
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Final Score:</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-label">Words per Minute:</span>
                <span className="stat-value">{wpm}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <span className="stat-label">Accuracy:</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Level Reached:</span>
                <span className="stat-value">{currentLevel}</span>
              </div>
            </div>
            <div className="game-over-actions">
              <button className="btn-primary" onClick={resetGame}>
                🔄 Try Again
              </button>
              <button className="btn-secondary" onClick={handleComplete}>
                ✅ Complete Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="typing-adventure">
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-text">
            🎉 Level Up! 🎉
          </div>
        </div>
      )}
      
      {showPowerUp && (
        <div className="power-up-notification">
          <div className="power-up-content">
            <span className="power-up-icon">{showPowerUp.icon}</span>
            <span className="power-up-name">{showPowerUp.name}</span>
            <button 
              className="power-up-button"
              onClick={() => activatePowerUp(showPowerUp)}
            >
              Collect!
            </button>
          </div>
        </div>
      )}

      <div className="adventure-header">
        <h1>🏰 Typing Adventure 🏰</h1>
        <div className="adventure-stats">
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{lives}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⏰</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="adventure-content">
        <div className="level-indicator">
          <h3>Level {currentLevel}</h3>
          <div className="level-progress">
            <div 
              className="level-bar" 
              style={{ width: `${(streak / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="word-display">
          <div className="word-container">
            {currentWord.split('').map((char, index) => (
              <span 
                key={index}
                className={`word-char ${
                  index < currentCharacter ? 'correct' : 
                  index === currentCharacter ? 'current' : 'pending'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the word above..."
            className="typing-input"
            disabled={gameState !== 'playing'}
          />
        </div>

        <div className="progress-info">
          <div className="wpm-display">
            <span className="wpm-label">Speed:</span>
            <span className="wpm-value">{wpm} WPM</span>
          </div>
          <div className="accuracy-display">
            <span className="accuracy-label">Accuracy:</span>
            <span className="accuracy-value">{accuracy}%</span>
          </div>
        </div>

        <div className="adventure-hint">
          <p>💡 Type the word as fast as you can! Complete 5 words in a row to level up!</p>
        </div>
      </div>

      <div className="adventure-footer">
        <button 
          className="btn-pause"
          onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
        >
          {gameState === 'playing' ? '⏸️ Pause' : '▶️ Resume'}
        </button>
        <button className="btn-complete" onClick={handleComplete}>
          ✅ Complete Lesson
        </button>
      </div>
    </div>
  )
}

export default TypingAdventure
