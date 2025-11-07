// Code Quest - Gamified Block Coding Lesson for Kids
import React, { useState, useEffect, useRef } from 'react'
import { useSound } from '../../lib/soundEffects'
import './CodeQuest.css'

const CodeQuest = ({ onComplete, onProgress }) => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [gameState, setGameState] = useState('playing') // playing, completed, gameOver
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [isCorrect, setIsCorrect] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes per challenge (increased for kids)
  const [stars, setStars] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 }) // For cat movement visualization
  const [isAnimating, setIsAnimating] = useState(false)
  const [showGameBoard, setShowGameBoard] = useState(false)

  const { playClick, playBlockSelect, playSuccess, playError } = useSound()
  const intervalRef = useRef(null)

  // Block coding challenges for different levels
  const challenges = {
    1: [
      {
        id: 1,
        title: "🚀 Launch the Rocket",
        description: "Help the rocket reach the moon! Use the correct sequence of blocks.",
        target: "moon",
        blocks: [
          { id: 'move_up', text: 'Move Up', icon: '⬆️', type: 'action' },
          { id: 'move_down', text: 'Move Down', icon: '⬇️', type: 'action' },
          { id: 'move_left', text: 'Move Left', icon: '⬅️', type: 'action' },
          { id: 'move_right', text: 'Move Right', icon: '➡️', type: 'action' },
          { id: 'start', text: 'Start', icon: '🚀', type: 'start' },
          { id: 'end', text: 'End', icon: '🏁', type: 'end' }
        ],
        solution: ['start', 'move_up', 'move_up', 'move_right', 'move_right', 'end'],
        hint: "The rocket needs to go up twice, then right twice to reach the moon!"
      },
      {
        id: 2,
        title: "🐱 Feed the Cat",
        description: "Guide the cat to its food bowl using the shortest path.",
        target: "food",
        blocks: [
          { id: 'move_up', text: 'Move Up', icon: '⬆️', type: 'action' },
          { id: 'move_down', text: 'Move Down', icon: '⬇️', type: 'action' },
          { id: 'move_left', text: 'Move Left', icon: '⬅️', type: 'action' },
          { id: 'move_right', text: 'Move Right', icon: '➡️', type: 'action' },
          { id: 'start', text: 'Start', icon: '🐱', type: 'start' },
          { id: 'end', text: 'End', icon: '🍽️', type: 'end' }
        ],
        solution: ['start', 'move_right', 'move_down', 'end'],
        hint: "Go right once, then down once to reach the food bowl!"
      }
    ],
    2: [
      {
        id: 3,
        title: "🔄 Loop the Loop",
        description: "Use a loop to collect all the stars!",
        target: "stars",
        blocks: [
          { id: 'move_up', text: 'Move Up', icon: '⬆️', type: 'action' },
          { id: 'move_down', text: 'Move Down', icon: '⬇️', type: 'action' },
          { id: 'move_left', text: 'Move Left', icon: '⬅️', type: 'action' },
          { id: 'move_right', text: 'Move Right', icon: '➡️', type: 'action' },
          { id: 'loop_3', text: 'Repeat 3 Times', icon: '🔄', type: 'loop' },
          { id: 'start', text: 'Start', icon: '⭐', type: 'start' },
          { id: 'end', text: 'End', icon: '🏁', type: 'end' }
        ],
        solution: ['start', 'loop_3', 'move_right', 'move_up', 'end'],
        hint: "Use the loop block to repeat the movement 3 times!"
      },
      {
        id: 4,
        title: "🎯 Hit the Target",
        description: "Program the arrow to hit the bullseye with a loop!",
        target: "target",
        blocks: [
          { id: 'move_up', text: 'Move Up', icon: '⬆️', type: 'action' },
          { id: 'move_down', text: 'Move Down', icon: '⬇️', type: 'action' },
          { id: 'move_left', text: 'Move Left', icon: '⬅️', type: 'action' },
          { id: 'move_right', text: 'Move Right', icon: '➡️', type: 'action' },
          { id: 'loop_2', text: 'Repeat 2 Times', icon: '🔄', type: 'loop' },
          { id: 'start', text: 'Start', icon: '🏹', type: 'start' },
          { id: 'end', text: 'End', icon: '🎯', type: 'end' }
        ],
        solution: ['start', 'move_right', 'loop_2', 'move_up', 'end'],
        hint: "Move right once, then use a loop to move up twice!"
      }
    ],
    3: [
      {
        id: 5,
        title: "🤖 Robot Dance",
        description: "Create a dance sequence using loops and conditions!",
        target: "dance",
        blocks: [
          { id: 'move_up', text: 'Move Up', icon: '⬆️', type: 'action' },
          { id: 'move_down', text: 'Move Down', icon: '⬇️', type: 'action' },
          { id: 'move_left', text: 'Move Left', icon: '⬅️', type: 'action' },
          { id: 'move_right', text: 'Move Right', icon: '➡️', type: 'action' },
          { id: 'loop_4', text: 'Repeat 4 Times', icon: '🔄', type: 'loop' },
          { id: 'if_condition', text: 'If Path Clear', icon: '🤔', type: 'condition' },
          { id: 'start', text: 'Start', icon: '🤖', type: 'start' },
          { id: 'end', text: 'End', icon: '💃', type: 'end' }
        ],
        solution: ['start', 'loop_4', 'if_condition', 'move_right', 'move_up', 'end'],
        hint: "Use a loop with a condition to create a dance pattern!"
      }
    ]
  }

  // Available blocks for the current challenge
  const availableBlocks = challenges[currentLevel]?.[currentChallenge]?.blocks || []

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
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
      setCurrentChallenge(0)
      setSelectedBlocks([])
      setIsCorrect(null)
      setShowHint(false)
      setTimeLeft(180) // Increased time
      setCatPosition({ x: 0, y: 0 })
      setIsAnimating(false)
      setShowGameBoard(false)
    }
  }, [currentLevel, gameState])

  const handleTimeUp = () => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setGameState('gameOver')
      }
      return newLives
    })
    setStreak(0)
    nextChallenge()
  }

  const handleBlockSelect = (block) => {
    if (selectedBlocks.length >= 8) return // Limit sequence length
    playBlockSelect()
    setSelectedBlocks(prev => [...prev, block.id])
  }

  const handleBlockRemove = (index) => {
    playClick()
    setSelectedBlocks(prev => prev.filter((_, i) => i !== index))
  }

  const animateCatMovement = async (blocks) => {
    setIsAnimating(true)
    setShowGameBoard(true)
    let currentPos = { x: 0, y: 0 }
    setCatPosition(currentPos)

    // Filter out start and end blocks
    const movementBlocks = blocks.filter(b => b.startsWith('move_'))

    for (let i = 0; i < movementBlocks.length; i++) {
      const block = movementBlocks[i]
      await new Promise(resolve => {
        setTimeout(() => {
          if (block === 'move_up') {
            currentPos.y = Math.max(0, currentPos.y - 1)
          } else if (block === 'move_down') {
            currentPos.y = Math.min(4, currentPos.y + 1)
          } else if (block === 'move_left') {
            currentPos.x = Math.max(0, currentPos.x - 1)
          } else if (block === 'move_right') {
            currentPos.x = Math.min(4, currentPos.x + 1)
          }
          setCatPosition({ ...currentPos })
          playClick()
          resolve()
        }, 800) // Slower movement - 800ms per step (was faster)
      })
    }

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const checkSolution = async () => {
    const currentChallengeData = challenges[currentLevel][currentChallenge]
    const solution = currentChallengeData.solution
    
    // Animate the cat movement first
    await animateCatMovement(selectedBlocks)
    
    // Check if solution matches
    const isSolutionCorrect = JSON.stringify(selectedBlocks) === JSON.stringify(solution)
    setIsCorrect(isSolutionCorrect)
    
    if (isSolutionCorrect) {
      playSuccess()
      const points = 100 + (streak * 50) + (timeLeft * 2)
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setStars(prev => prev + 1)
      
      // Check for achievements
      checkAchievements()
      
      setTimeout(() => {
        nextChallenge()
      }, 3000) // Increased delay to see the result
    } else {
      playError()
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

  const checkAchievements = () => {
    const newAchievements = []
    
    if (streak >= 3 && !achievements.includes('streak_master')) {
      newAchievements.push('streak_master')
    }
    
    if (stars >= 5 && !achievements.includes('star_collector')) {
      newAchievements.push('star_collector')
    }
    
    if (currentLevel >= 2 && !achievements.includes('level_up')) {
      newAchievements.push('level_up')
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements])
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const nextChallenge = () => {
    const currentLevelChallenges = challenges[currentLevel]
    
    if (currentChallenge + 1 < currentLevelChallenges.length) {
      setCurrentChallenge(prev => prev + 1)
      setSelectedBlocks([])
      setIsCorrect(null)
      setShowHint(false)
      setTimeLeft(180) // Increased time
      setCatPosition({ x: 0, y: 0 })
      setIsAnimating(false)
      setShowGameBoard(false)
    } else {
      // Level completed
      if (currentLevel < 3) {
        setCurrentLevel(prev => prev + 1)
        setCurrentChallenge(0)
        setSelectedBlocks([])
        setIsCorrect(null)
        setShowHint(false)
        setTimeLeft(180) // Increased time
        setCatPosition({ x: 0, y: 0 })
        setIsAnimating(false)
        setShowGameBoard(false)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        setGameState('completed')
      }
    }
  }

  const handleComplete = () => {
    const finalScore = score + (lives * 100) + (stars * 50)
    onComplete({
      score: finalScore,
      level: currentLevel,
      challengesCompleted: currentChallenge + 1,
      stars: stars,
      achievements: achievements.length
    })
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setScore(0)
    setLives(3)
    setStreak(0)
    setGameState('playing')
    setCurrentChallenge(0)
    setSelectedBlocks([])
    setIsCorrect(null)
    setShowHint(false)
    setTimeLeft(180) // Increased time
    setStars(0)
    setAchievements([])
    setCatPosition({ x: 0, y: 0 })
    setIsAnimating(false)
    setShowGameBoard(false)
  }

  const getAchievementInfo = (achievementId) => {
    const achievementMap = {
      'streak_master': { name: 'Streak Master', icon: '🔥', description: 'Got 3 challenges in a row!' },
      'star_collector': { name: 'Star Collector', icon: '⭐', description: 'Collected 5 stars!' },
      'level_up': { name: 'Level Up', icon: '📈', description: 'Reached level 2!' }
    }
    return achievementMap[achievementId]
  }

  if (gameState === 'gameOver') {
    return (
      <div className="code-quest">
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>🤖 Keep Coding! 🤖</h2>
            <p>Don't give up! Every programmer learns from mistakes. Try again to become a coding master!</p>
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Score:</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Stars:</span>
                <span className="stat-value">{stars}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📚</span>
                <span className="stat-label">Level:</span>
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

  if (gameState === 'completed') {
    return (
      <div className="code-quest">
        <div className="completion-screen">
          <div className="completion-content">
            <h2>🎉 Coding Master! 🎉</h2>
            <p>Congratulations! You've completed the Code Quest and become a programming hero!</p>
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Final Score:</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Stars Collected:</span>
                <span className="stat-value">{stars}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔥</span>
                <span className="stat-label">Best Streak:</span>
                <span className="stat-value">{streak}</span>
              </div>
            </div>
            {achievements.length > 0 && (
              <div className="achievements-earned">
                <h3>🏅 Achievements Unlocked:</h3>
                <div className="achievements-grid">
                  {achievements.map(achievementId => {
                    const achievement = getAchievementInfo(achievementId)
                    return (
                      <div key={achievementId} className="achievement-item">
                        <span className="achievement-icon">{achievement.icon}</span>
                        <div className="achievement-text">
                          <div className="achievement-name">{achievement.name}</div>
                          <div className="achievement-description">{achievement.description}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <button className="btn-complete" onClick={handleComplete}>
              ✅ Complete Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentChallengeData = challenges[currentLevel][currentChallenge]

  return (
    <div className="code-quest">
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-text">
            🎉 {currentLevel < 3 ? 'Level Up!' : 'Quest Complete!'} 🎉
          </div>
        </div>
      )}

      <div className="quest-header">
        <h1>🤖 Code Quest 🤖</h1>
        <div className="quest-stats">
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
            <span className="stat-icon">🏆</span>
            <span className="stat-value">{stars}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⏰</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="quest-content">
        <div className="level-indicator">
          <h3>Level {currentLevel} - Challenge {currentChallenge + 1}</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentChallenge + 1) / challenges[currentLevel].length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="challenge-card">
          <div className="challenge-header">
            <h2>{currentChallengeData.title}</h2>
            <p>{currentChallengeData.description}</p>
          </div>

          {/* Game Board Visualization - especially for cat challenge */}
          {(currentChallengeData.target === 'food' || showGameBoard) && (
            <div className="game-board-container">
              <h4>Watch the Cat Move! 🐱</h4>
              <div className="game-board">
                {Array.from({ length: 5 }).map((_, row) => (
                  <div key={row} className="game-row">
                    {Array.from({ length: 5 }).map((_, col) => {
                      const isCat = catPosition.x === col && catPosition.y === row
                      const isFood = col === 4 && row === 4 && currentChallengeData.target === 'food'
                      const isStart = col === 0 && row === 0 && currentChallengeData.target === 'food'
                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`game-cell ${isCat ? 'cat-cell' : ''} ${isFood ? 'food-cell' : ''} ${isStart ? 'start-cell' : ''}`}
                        >
                          {isCat && <span className="cat-emoji">🐱</span>}
                          {isFood && !isCat && <span className="food-emoji">🍽️</span>}
                          {isStart && !isCat && currentChallengeData.target === 'food' && <span className="start-emoji">🏠</span>}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              {isAnimating && <p className="animation-hint">The cat is moving... Watch carefully! 👀</p>}
            </div>
          )}

          <div className="code-workspace">
            <div className="sequence-area">
              <h4>Your Code Sequence:</h4>
              <div className="sequence-blocks">
                {selectedBlocks.map((blockId, index) => {
                  const block = availableBlocks.find(b => b.id === blockId)
                  return (
                    <div key={index} className="sequence-block">
                      <span className="block-icon">{block?.icon}</span>
                      <span className="block-text">{block?.text}</span>
                      <button 
                        className="remove-block"
                        onClick={() => handleBlockRemove(index)}
                      >
                        ❌
                      </button>
                    </div>
                  )
                })}
                {selectedBlocks.length === 0 && (
                  <div className="empty-sequence">
                    Click blocks below to create your code!
                  </div>
                )}
              </div>
            </div>

            <div className="blocks-palette">
              <h4>Available Blocks:</h4>
              <div className="blocks-grid">
                {availableBlocks.map(block => (
                  <button
                    key={block.id}
                    className={`code-block ${block.type}`}
                    onClick={() => handleBlockSelect(block)}
                    disabled={selectedBlocks.length >= 8}
                  >
                    <span className="block-icon">{block.icon}</span>
                    <span className="block-text">{block.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="challenge-actions">
            <button 
              className="btn-hint"
              onClick={() => setShowHint(!showHint)}
            >
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button 
              className="btn-run"
              onClick={checkSolution}
              disabled={selectedBlocks.length === 0}
            >
              ▶️ Run Code
            </button>
          </div>

          {showHint && (
            <div className="hint-box">
              <div className="hint-content">
                <span className="hint-icon">💡</span>
                <span className="hint-text">{currentChallengeData.hint}</span>
              </div>
            </div>
          )}

          {isCorrect !== null && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="feedback-content">
                <div className="feedback-message">
                  {isCorrect ? 'Great job! Your code works perfectly!' : 'Not quite right. Try again!'}
                </div>
                {isCorrect && (
                  <div className="feedback-tip">
                    🎉 You earned {100 + (streak * 50) + (timeLeft * 2)} points!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeQuest
