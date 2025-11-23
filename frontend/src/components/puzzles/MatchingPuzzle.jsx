// Matching Puzzle Component
import React, { useState } from 'react';
import './PuzzleStyles.css';

const MatchingPuzzle = ({ puzzleData, onComplete }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleItemClick = (item) => {
    if (selectedItems.length === 0) {
      setSelectedItems([item]);
    } else if (selectedItems.length === 1) {
      const firstItem = selectedItems[0];
      const isMatch = firstItem.pairId === item.pairId && firstItem.id !== item.id;
      
      if (isMatch) {
        setMatches(prev => [...prev, { left: firstItem, right: item }]);
        setScore(prev => prev + 1);
      }
      
      setSelectedItems([]);
      
      // Check if all items are matched
      const totalPairs = puzzleData.leftItems.length;
      if (matches.length + (isMatch ? 1 : 0) === totalPairs) {
        setCompleted(true);
        onComplete && onComplete(score + (isMatch ? 1 : 0), totalPairs);
      }
    }
  };

  const isItemMatched = (item) => {
    return matches.some(match => 
      match.left.id === item.id || match.right.id === item.id
    );
  };

  const isItemSelected = (item) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <h3>{puzzleData.title}</h3>
        <p>{puzzleData.instructions}</p>
        <div className="puzzle-score">
          Matches: {matches.length}/{puzzleData.leftItems.length}
        </div>
      </div>

      <div className="puzzle-content">
        <div className="matching-puzzle">
          {/* Left Column */}
          <div className="matching-column left-column">
            <h4>Left Side:</h4>
            {puzzleData.leftItems.map(item => (
              <div
                key={item.id}
                className={`matching-item left-item ${
                  isItemMatched(item) ? 'matched' : 
                  isItemSelected(item) ? 'selected' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.content}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="matching-column right-column">
            <h4>Right Side:</h4>
            {puzzleData.rightItems.map(item => (
              <div
                key={item.id}
                className={`matching-item right-item ${
                  isItemMatched(item) ? 'matched' : 
                  isItemSelected(item) ? 'selected' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      {completed && (
        <div className="puzzle-completion">
          <h3>🎉 Matching Complete!</h3>
          <p>You found all {matches.length} matches!</p>
        </div>
      )}
    </div>
  );
};

export default MatchingPuzzle;
