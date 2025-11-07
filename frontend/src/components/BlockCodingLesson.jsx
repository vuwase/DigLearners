import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'
import { useAuth } from '../contexts/AuthContext'
import { useSound } from '../lib/soundEffects'
import ProgressTracker from './ProgressTracker'
import Icon from './icons/Icon'
import './CodePlayStyles.css'

export default function BlockCodingLesson({ lesson, onComplete, onProgress }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { playNextButton, playClick, playSuccess } = useSound()
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [moves, setMoves] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [characterPosition, setCharacterPosition] = useState(0)

  const puzzles = [
    {
      id: 1,
      title: "Make the cat move forward",
      description: "Drag the 'move forward' block to make the cat walk!",
      target: ['move_forward'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: 'play' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: 'back' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: 'forward' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: 'progress' }
      ],
      hint: "Look for the green 'Move Forward' block!"
    },
    {
      id: 2,
      title: "Make the cat turn and move",
      description: "First turn left, then move forward!",
      target: ['turn_left', 'move_forward'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: 'play' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: 'back' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: 'forward' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: 'progress' }
      ],
      hint: "Drag 'Turn Left' first, then 'Move Forward'!"
    },
    {
      id: 3,
      title: "Create a sequence",
      description: "Make the cat: move forward, turn right, move forward again!",
      target: ['move_forward', 'turn_right', 'move_forward'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: 'play' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: 'back' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: 'forward' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: 'progress' }
      ],
      hint: "The sequence should be: Move → Turn Right → Move"
    },
    {
      id: 4,
      title: "Make the cat jump twice",
      description: "Use the jump block two times in a row!",
      target: ['jump', 'jump'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: 'play' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: 'back' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: 'forward' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: 'progress' }
      ],
      hint: "Drag the jump block twice to the sequence area!"
    },
    {
      id: 5,
      title: "Complex sequence",
      description: "Make the cat: move, turn left, move, turn right, jump!",
      target: ['move_forward', 'turn_left', 'move_forward', 'turn_right', 'jump'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: 'play' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: 'back' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: 'forward' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: 'progress' }
      ],
      hint: "Follow the pattern: Move → Turn Left → Move → Turn Right → Jump"
    }
  ]

  const currentPuzzleData = puzzles[currentPuzzle]

  useEffect(() => {
    setSelectedBlocks([])
    setShowHint(false)
    setMoves(0)
  }, [currentPuzzle])

  const getCharacterMessage = () => {
    if (isCompleted) {
      return "Great job! You solved it!"
    }
    
    if (isRunning) {
      return "Watch me execute your code!"
    }
    
    if (selectedBlocks.length === 0) {
      return currentPuzzleData.description
    }
    
    if (selectedBlocks.length < currentPuzzleData.target.length) {
      return "Keep going! Add more blocks to complete the sequence."
    }
    
    if (selectedBlocks.length === currentPuzzleData.target.length) {
      return "Perfect! Now click 'Run' to see if your code works!"
    }
    
    return "Try running your code to see what happens!"
  }

  const runCode = async () => {
    if (selectedBlocks.length === 0) return
    
    setIsRunning(true)
    setCharacterPosition(0)
    
    // Animate character movement
    for (let i = 0; i < selectedBlocks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setCharacterPosition(i + 1)
    }
    
    // Check if solution is correct
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsRunning(false)
    
    if (checkSolution()) {
      setIsCompleted(true)
      if (onComplete) {
        onComplete({
          puzzleId: currentPuzzleData.id,
          moves,
          timeElapsed: Date.now()
        })
      }
    } else {
      alert("Not quite right! Try again. Remember to follow the instructions exactly!")
    }
  }

  const resetStage = () => {
    setCharacterPosition(0)
    setIsRunning(false)
  }

  const handleBlockClick = (blockId) => {
    if (isCompleted) return
    
    setMoves(moves + 1)
    setSelectedBlocks([...selectedBlocks, blockId])
  }

  const removeBlock = (index) => {
    if (isCompleted) return
    
    const newBlocks = selectedBlocks.filter((_, i) => i !== index)
    setSelectedBlocks(newBlocks)
  }

  const clearSequence = () => {
    setSelectedBlocks([])
  }

  const checkSolution = () => {
    if (selectedBlocks.length !== currentPuzzleData.target.length) return false
    
    return selectedBlocks.every((block, index) => block === currentPuzzleData.target[index])
  }

  const handleRun = () => {
    if (checkSolution()) {
      setIsCompleted(true)
      if (onComplete) {
        onComplete({
          puzzleId: currentPuzzleData.id,
          moves,
          timeElapsed: Date.now() // You could track actual time
        })
      }
    } else {
      alert("Not quite right! Try again. Remember to follow the instructions exactly!")
    }
  }

  const handleNext = () => {
    playNextButton()
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1)
      setIsCompleted(false)
    } else {
      // All puzzles completed
      if (onComplete) {
        onComplete({
          allPuzzlesCompleted: true,
          totalPuzzles: puzzles.length
        })
      }
    }
    
    if (onProgress) {
      onProgress({
        progress: ((currentPuzzle + 1) / puzzles.length) * 100,
        currentPuzzle: currentPuzzle + 1,
        totalPuzzles: puzzles.length
      })
    }
  }

  const resetPuzzle = () => {
    setSelectedBlocks([])
    setIsCompleted(false)
    setShowHint(false)
    setMoves(0)
  }

  return (
    <div className="block-coding-lesson">
      {/* CodePlay-style header */}
      <div className="lesson-header codeplay-header">
        <div className="header-left">
          <h1 className="codeplay-title">CodePlay</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="avatar">🐱</div>
            <span className="user-name">Hi, {user?.fullName?.split(' ')[0] || 'Student'}</span>
          </div>
        </div>
      </div>

      {/* Main lesson area */}
      <div className="lesson-content">
        <div className="lesson-info">
          <h2>{lesson?.title || t('lesson.block_puzzles')}</h2>
          
          {/* Enhanced progress tracking */}
          <ProgressTracker 
            currentProgress={currentPuzzle + 1}
            totalItems={puzzles.length}
            showStats={true}
            showLevel={true}
          />
        </div>

        {/* CodePlay-style main area */}
        <div className="codeplay-main-area">
          {/* Left side - Code Blocks Area */}
          <div className="code-blocks-area">
            <div className="puzzle-description">
              <h3>{currentPuzzleData.title}</h3>
              <p>{currentPuzzleData.description}</p>
              <div className="moves-counter">
                Moves: {moves}
              </div>
            </div>

            <div className="coding-workspace">
              <div className="sequence-area">
                <h4>Your Code:</h4>
                <div className="sequence-blocks">
                  {selectedBlocks.map((blockId, index) => {
                    const block = currentPuzzleData.availableBlocks.find(b => b.id === blockId)
                    return (
                      <div
                        key={index}
                        className="sequence-block"
                        style={{ backgroundColor: block?.color }}
                        onClick={() => removeBlock(index)}
                      >
                        <span className="block-icon">{block?.icon}</span>
                        <span className="block-text">{block?.text}</span>
                        <span className="remove-block">×</span>
                      </div>
                    )
                  })}
                  {selectedBlocks.length === 0 && (
                    <div className="empty-sequence">
                      Drag blocks here to create your code!
                    </div>
                  )}
                </div>
              </div>

              <div className="blocks-palette">
                <h4>Available Blocks:</h4>
                <div className="blocks-grid">
                  {currentPuzzleData.availableBlocks.map((block) => (
                    <button
                      key={block.id}
                      className="code-block"
                      style={{ backgroundColor: block.color }}
                      onClick={() => handleBlockClick(block.id)}
                      disabled={isCompleted}
                    >
                      <span className="block-icon">{block.icon}</span>
                      <span className="block-text">{block.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Interactive Stage/Game Area */}
          <div className="interactive-stage">
            <div className="stage-header">
              <h4>Game Stage</h4>
            </div>
            <div className="game-area">
              <div className="game-environment">
                <div className="sky"></div>
                <div className="grass"></div>
                <div className="character-area" style={{ left: `${20 + (characterPosition * 40)}px` }}>
                  <div className="cat-character">🐱</div>
                  <div className="speech-bubble">
                    {getCharacterMessage()}
                  </div>
                </div>
                <div className="path-area">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div 
                      key={index}
                      className={`path-tile ${index === 4 ? 'target' : ''} ${
                        index < characterPosition ? 'visited' : ''
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="stage-controls">
              <button 
                className="reset-stage" 
                onClick={resetStage}
                disabled={isRunning}
              >
                Reset
              </button>
              <button 
                className="hint-stage" 
                onClick={() => setShowHint(!showHint)}
              >
                <Icon name="help" size={16} />
              </button>
              <button 
                className="run-stage" 
                onClick={runCode}
                disabled={selectedBlocks.length === 0 || isRunning}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
        </div>

        <div className="puzzle-controls">
          <button onClick={clearSequence} className="clear-button">
            <Icon name="cross" size={16} style={{ marginRight: '8px' }} />
            Clear
          </button>
          <button onClick={handleRun} className="run-button" disabled={selectedBlocks.length === 0}>
            <Icon name="play" size={16} style={{ marginRight: '8px' }} />
            Run Code
          </button>
          <button onClick={() => setShowHint(!showHint)} className="hint-button">
            <Icon name="help" size={16} style={{ marginRight: '8px' }} />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>

        {showHint && (
          <div className="hint-box">
            <h4>
              <Icon name="help" size={16} style={{ marginRight: '8px' }} />
              Hint:
            </h4>
            <p>{currentPuzzleData.hint}</p>
          </div>
        )}

        {isCompleted && (
          <div className="completion-message">
            <h3>
              <Icon name="star" size={20} style={{ marginRight: '8px' }} />
              Great job!
            </h3>
            <p>You solved the puzzle in {moves} moves!</p>
            <button onClick={handleNext} className="next-button">
              {currentPuzzle < puzzles.length - 1 ? t('common.next') : t('common.finish')} →
            </button>
          </div>
        )}
      </div>

      <div className="lesson-controls">
        <button onClick={resetPuzzle} className="reset-button">
          <Icon name="recent" size={16} style={{ marginRight: '8px' }} />
          {t('common.restart')}
        </button>
      </div>

      <div className="coding-tips">
        <h4>
          <Icon name="puzzle" size={20} style={{ marginRight: '8px' }} />
          Coding Tips:
        </h4>
        <ul>
          <li>Read the instructions carefully</li>
          <li>Think about the order of your blocks</li>
          <li>You can remove blocks by clicking on them</li>
          <li>Use the hint if you get stuck</li>
          <li>Don't worry about mistakes - just try again!</li>
        </ul>
      </div>
    </div>
  )
}
