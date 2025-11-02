// Sequencing Puzzle Component
import React, { useState } from 'react';
import './PuzzleStyles.css';

const SequencingPuzzle = ({ puzzleData, onComplete }) => {
  const [sequence, setSequence] = useState([]);
  const [availableItems, setAvailableItems] = useState(puzzleData.items || []);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleItemClick = (item) => {
    if (sequence.length < puzzleData.correctSequence.length) {
      const newSequence = [...sequence, item];
      setSequence(newSequence);
      
      // Remove item from available items
      setAvailableItems(prev => prev.filter(i => i.id !== item.id));
      
      // Check if sequence is correct so far
      const isCorrect = newSequence.every((item, index) => 
        item.id === puzzleData.correctSequence[index].id
      );
      
      if (isCorrect && newSequence.length === puzzleData.correctSequence.length) {
        setCompleted(true);
        setScore(puzzleData.correctSequence.length);
        onComplete && onComplete(puzzleData.correctSequence.length, puzzleData.correctSequence.length);
      } else if (!isCorrect) {
        // Reset sequence if incorrect
        setTimeout(() => {
          setSequence([]);
          setAvailableItems(puzzleData.items);
        }, 1000);
      }
    }
  };

  const resetPuzzle = () => {
    setSequence([]);
    setAvailableItems(puzzleData.items);
    setCompleted(false);
    setScore(0);
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <h3>{puzzleData.title}</h3>
        <p>{puzzleData.instructions}</p>
        <div className="puzzle-score">
          Sequence: {sequence.length}/{puzzleData.correctSequence.length}
        </div>
      </div>

      <div className="puzzle-content">
        {/* Current Sequence */}
        <div className="sequence-container">
          <h4>Your Sequence:</h4>
          <div className="sequence-display">
            {sequence.map((item, index) => (
              <div key={`${item.id}-${index}`} className="sequence-item">
                {index + 1}. {item.content}
              </div>
            ))}
            {sequence.length < puzzleData.correctSequence.length && (
              <div className="sequence-placeholder">
                {sequence.length + 1}. Click an item below
              </div>
            )}
          </div>
        </div>

        {/* Available Items */}
        <div className="available-items-container">
          <h4>Available Items:</h4>
          <div className="available-items">
            {availableItems.map(item => (
              <div
                key={item.id}
                className="available-item"
                onClick={() => handleItemClick(item)}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="puzzle-controls">
          <button onClick={resetPuzzle} className="reset-button">
            Reset Puzzle
          </button>
        </div>
      </div>

      {completed && (
        <div className="puzzle-completion">
          <h3>🎉 Sequence Complete!</h3>
          <p>You got the correct sequence!</p>
        </div>
      )}
    </div>
  );
};

export default SequencingPuzzle;
