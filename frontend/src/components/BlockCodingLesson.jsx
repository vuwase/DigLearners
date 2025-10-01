import React, { useState, useEffect } from 'react'
import { useTranslation } from '../lib/language'

export default function BlockCodingLesson({ lesson, onComplete, onProgress }) {
  const { t } = useTranslation()
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [moves, setMoves] = useState(0)

  const puzzles = [
    {
      id: 1,
      title: "Make the cat move forward",
      description: "Drag the 'move forward' block to make the cat walk!",
      target: ['move_forward'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: '🚶' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: '↶' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: '↷' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: '🦘' }
      ],
      hint: "Look for the green 'Move Forward' block!"
    },
    {
      id: 2,
      title: "Make the cat turn and move",
      description: "First turn left, then move forward!",
      target: ['turn_left', 'move_forward'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: '🚶' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: '↶' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: '↷' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: '🦘' }
      ],
      hint: "Drag 'Turn Left' first, then 'Move Forward'!"
    },
    {
      id: 3,
      title: "Create a sequence",
      description: "Make the cat: move forward, turn right, move forward again!",
      target: ['move_forward', 'turn_right', 'move_forward'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: '🚶' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: '↶' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: '↷' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: '🦘' }
      ],
      hint: "The sequence should be: Move → Turn Right → Move"
    },
    {
      id: 4,
      title: "Make the cat jump twice",
      description: "Use the jump block two times in a row!",
      target: ['jump', 'jump'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: '🚶' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: '↶' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: '↷' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: '🦘' }
      ],
      hint: "Drag the jump block twice to the sequence area!"
    },
    {
      id: 5,
      title: "Complex sequence",
      description: "Make the cat: move, turn left, move, turn right, jump!",
      target: ['move_forward', 'turn_left', 'move_forward', 'turn_right', 'jump'],
      availableBlocks: [
        { id: 'move_forward', text: 'Move Forward', color: '#4CAF50', icon: '🚶' },
        { id: 'turn_left', text: 'Turn Left', color: '#2196F3', icon: '↶' },
        { id: 'turn_right', text: 'Turn Right', color: '#2196F3', icon: '↷' },
        { id: 'jump', text: 'Jump', color: '#FF9800', icon: '🦘' }
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
      <div className="lesson-header">
        <h2>{lesson?.title || t('lesson.block_puzzles')}</h2>
        <div className="lesson-progress">
          <span>Puzzle {currentPuzzle + 1} of {puzzles.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentPuzzle + 1) / puzzles.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="puzzle-area">
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

        <div className="puzzle-controls">
          <button onClick={clearSequence} className="clear-button">
            🗑️ Clear
          </button>
          <button onClick={handleRun} className="run-button" disabled={selectedBlocks.length === 0}>
            ▶️ Run Code
          </button>
          <button onClick={() => setShowHint(!showHint)} className="hint-button">
            💡 {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>

        {showHint && (
          <div className="hint-box">
            <h4>💡 Hint:</h4>
            <p>{currentPuzzleData.hint}</p>
          </div>
        )}

        {isCompleted && (
          <div className="completion-message">
            <h3>🎉 Great job!</h3>
            <p>You solved the puzzle in {moves} moves!</p>
            <button onClick={handleNext} className="next-button">
              {currentPuzzle < puzzles.length - 1 ? t('common.next') : t('common.finish')} →
            </button>
          </div>
        )}
      </div>

      <div className="lesson-controls">
        <button onClick={resetPuzzle} className="reset-button">
          🔄 {t('common.restart')}
        </button>
      </div>

      <div className="coding-tips">
        <h4>🧩 Coding Tips:</h4>
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
