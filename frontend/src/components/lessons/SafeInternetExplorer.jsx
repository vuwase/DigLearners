// Safe Internet Explorer - Gamified Internet Safety Lesson for Kids
import React, { useState, useEffect } from 'react'
import './SafeInternetExplorer.css'

const SafeInternetExplorer = ({ onComplete, onProgress }) => {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [gameState, setGameState] = useState('playing') // playing, completed, gameOver
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [badges, setBadges] = useState([])
  const [showBadge, setShowBadge] = useState(null)

  // Internet safety scenarios with multiple choice questions
  const scenarios = [
    {
      id: 1,
      title: "🛡️ Password Protection",
      description: "You're creating a new account for your favorite game. What should you do?",
      image: "🔐",
      options: [
        { text: "Use your pet's name as password", correct: false, explanation: "Pet names are easy to guess!" },
        { text: "Use a strong password with numbers and symbols", correct: true, explanation: "Great! Strong passwords keep your account safe." },
        { text: "Use the same password for all accounts", correct: false, explanation: "Using the same password everywhere is risky!" },
        { text: "Write your password on a sticky note", correct: false, explanation: "Never write passwords where others can see them!" }
      ],
      tip: "💡 A strong password should have at least 8 characters with letters, numbers, and symbols!"
    },
    {
      id: 2,
      title: "👥 Stranger Danger Online",
      description: "Someone you don't know sends you a friend request. What should you do?",
      image: "🚨",
      options: [
        { text: "Accept the request immediately", correct: false, explanation: "Never accept requests from strangers!" },
        { text: "Ask your parents first", correct: true, explanation: "Perfect! Always check with trusted adults." },
        { text: "Send them your personal information", correct: false, explanation: "Never share personal info with strangers!" },
        { text: "Meet them in person", correct: false, explanation: "Never meet online strangers in real life!" }
      ],
      tip: "💡 Remember: If you wouldn't talk to them in real life, don't talk to them online!"
    },
    {
      id: 3,
      title: "📱 Social Media Safety",
      description: "You want to post a photo of your new bike. What should you consider?",
      image: "📸",
      options: [
        { text: "Post it with your home address", correct: false, explanation: "Never share your address online!" },
        { text: "Ask permission and check what's in the background", correct: true, explanation: "Excellent! Always be careful about what's visible." },
        { text: "Post it without any privacy settings", correct: false, explanation: "Use privacy settings to control who sees your posts!" },
        { text: "Tag everyone you know", correct: false, explanation: "Only tag people who are okay with being tagged!" }
      ],
      tip: "💡 Before posting, ask: Would I want my teacher or grandparents to see this?"
    },
    {
      id: 4,
      title: "🎁 Online Offers",
      description: "You get a message saying you won a free iPad! What should you do?",
      image: "🎁",
      options: [
        { text: "Click the link immediately", correct: false, explanation: "This could be a scam! Don't click suspicious links." },
        { text: "Give them your personal information", correct: false, explanation: "Never give personal info to unknown sources!" },
        { text: "Ignore the message and tell an adult", correct: true, explanation: "Smart! If it sounds too good to be true, it probably is!" },
        { text: "Share it with all your friends", correct: false, explanation: "Don't share suspicious messages with others!" }
      ],
      tip: "💡 Remember: If something seems too good to be true, it usually is!"
    },
    {
      id: 5,
      title: "💬 Cyberbullying",
      description: "Someone is being mean to your friend online. What should you do?",
      image: "💔",
      options: [
        { text: "Join in and be mean too", correct: false, explanation: "Never join in cyberbullying!" },
        { text: "Ignore it and hope it stops", correct: false, explanation: "Cyberbullying won't stop if we ignore it." },
        { text: "Stand up for your friend and tell an adult", correct: true, explanation: "Great! Always stand up for others and get help." },
        { text: "Share the mean messages", correct: false, explanation: "Don't spread hurtful content!" }
      ],
      tip: "💡 Be an upstander, not a bystander! Stand up for others online."
    },
    {
      id: 6,
      title: "🔍 Information Verification",
      description: "You see a shocking news story online. What should you do?",
      image: "📰",
      options: [
        { text: "Share it immediately with everyone", correct: false, explanation: "Always verify information before sharing!" },
        { text: "Check if it's from a reliable source", correct: true, explanation: "Perfect! Always verify information from trusted sources." },
        { text: "Believe everything you read online", correct: false, explanation: "Not everything online is true!" },
        { text: "Make up your own version", correct: false, explanation: "Don't spread false information!" }
      ],
      tip: "💡 Check multiple sources before believing or sharing information!"
    }
  ]

  // Badges that can be earned
  const availableBadges = [
    { id: 'password_protector', name: 'Password Protector', icon: '🔐', description: 'Learned about strong passwords' },
    { id: 'stranger_smart', name: 'Stranger Smart', icon: '🛡️', description: 'Knows how to handle strangers online' },
    { id: 'privacy_pro', name: 'Privacy Pro', icon: '🔒', description: 'Understands social media privacy' },
    { id: 'scam_stopper', name: 'Scam Stopper', icon: '🚫', description: 'Can identify online scams' },
    { id: 'upstander', name: 'Upstander', icon: '💪', description: 'Stands up against cyberbullying' },
    { id: 'fact_checker', name: 'Fact Checker', icon: '🔍', description: 'Verifies information before sharing' }
  ]

  useEffect(() => {
    if (gameState === 'playing' && currentScenario >= scenarios.length) {
      setGameState('completed')
    }
  }, [currentScenario, gameState, scenarios.length])

  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return // Prevent multiple selections
    
    setSelectedAnswer(option)
    setIsCorrect(option.correct)
    setShowFeedback(true)
    
    if (option.correct) {
      const points = 100 + (streak * 50)
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setFeedbackMessage(option.explanation)
      
      // Check for badge earning
      const scenario = scenarios[currentScenario]
      const badgeId = getBadgeIdForScenario(scenario.id)
      if (badgeId && !badges.includes(badgeId)) {
        const badge = availableBadges.find(b => b.id === badgeId)
        if (badge) {
          setBadges(prev => [...prev, badgeId])
          setShowBadge(badge)
          setTimeout(() => setShowBadge(null), 3000)
        }
      }
    } else {
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          setGameState('gameOver')
        }
        return newLives
      })
      setStreak(0)
      setFeedbackMessage(option.explanation)
    }

    // Update progress
    onProgress({
      currentScenario: currentScenario + 1,
      totalScenarios: scenarios.length,
      score: score + (option.correct ? 100 + (streak * 50) : 0),
      accuracy: Math.round(((currentScenario + 1) / scenarios.length) * 100)
    })
  }

  const getBadgeIdForScenario = (scenarioId) => {
    const badgeMap = {
      1: 'password_protector',
      2: 'stranger_smart',
      3: 'privacy_pro',
      4: 'scam_stopper',
      5: 'upstander',
      6: 'fact_checker'
    }
    return badgeMap[scenarioId]
  }

  const nextScenario = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCurrentScenario(prev => prev + 1)
  }

  const handleComplete = () => {
    const finalScore = score + (lives * 100) + (streak * 50)
    onComplete({
      score: finalScore,
      scenariosCompleted: currentScenario,
      totalScenarios: scenarios.length,
      badgesEarned: badges.length,
      accuracy: Math.round((currentScenario / scenarios.length) * 100)
    })
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setScore(0)
    setLives(3)
    setStreak(0)
    setGameState('playing')
    setSelectedAnswer(null)
    setShowFeedback(false)
    setBadges([])
  }

  if (gameState === 'gameOver') {
    return (
      <div className="safe-internet-explorer">
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>🛡️ Keep Learning! 🛡️</h2>
            <p>Don't worry! Internet safety is a skill that takes practice. Try again to become an Internet Safety Hero!</p>
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Score:</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Badges:</span>
                <span className="stat-value">{badges.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📚</span>
                <span className="stat-label">Scenarios:</span>
                <span className="stat-value">{currentScenario}/{scenarios.length}</span>
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
      <div className="safe-internet-explorer">
        <div className="completion-screen">
          <div className="completion-content">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You're now an Internet Safety Hero!</p>
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Final Score:</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Badges Earned:</span>
                <span className="stat-value">{badges.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔥</span>
                <span className="stat-label">Best Streak:</span>
                <span className="stat-value">{streak}</span>
              </div>
            </div>
            <div className="badges-earned">
              <h3>🏅 Badges You Earned:</h3>
              <div className="badges-grid">
                {badges.map(badgeId => {
                  const badge = availableBadges.find(b => b.id === badgeId)
                  return badge ? (
                    <div key={badgeId} className="badge-item">
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-name">{badge.name}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
            <button className="btn-complete" onClick={handleComplete}>
              ✅ Complete Lesson
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentScenarioData = scenarios[currentScenario]

  return (
    <div className="safe-internet-explorer">
      {showBadge && (
        <div className="badge-notification">
          <div className="badge-content">
            <span className="badge-icon">{showBadge.icon}</span>
            <div className="badge-text">
              <div className="badge-name">{showBadge.name}</div>
              <div className="badge-description">{showBadge.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="explorer-header">
        <h1>🛡️ Safe Internet Explorer 🛡️</h1>
        <div className="explorer-stats">
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
            <span className="stat-value">{badges.length}</span>
          </div>
        </div>
      </div>

      <div className="explorer-content">
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Scenario {currentScenario + 1} of {scenarios.length}
          </span>
        </div>

        <div className="scenario-card">
          <div className="scenario-header">
            <div className="scenario-icon">{currentScenarioData.image}</div>
            <h2>{currentScenarioData.title}</h2>
          </div>
          
          <div className="scenario-description">
            <p>{currentScenarioData.description}</p>
          </div>

          <div className="options-container">
            {currentScenarioData.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === option ? 
                    (option.correct ? 'correct' : 'incorrect') : 
                    selectedAnswer ? 'disabled' : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="feedback-content">
                <div className="feedback-message">{feedbackMessage}</div>
                {isCorrect && (
                  <div className="feedback-tip">{currentScenarioData.tip}</div>
                )}
              </div>
            </div>
          )}

          {selectedAnswer && (
            <div className="scenario-actions">
              <button 
                className="btn-next"
                onClick={nextScenario}
              >
                {currentScenario + 1 < scenarios.length ? 'Next Scenario ➡️' : 'Finish Lesson ✅'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SafeInternetExplorer
