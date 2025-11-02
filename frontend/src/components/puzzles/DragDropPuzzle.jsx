// Drag and Drop Puzzle Component
import React, { useState } from 'react';
import './PuzzleStyles.css';

const DragDropPuzzle = ({ puzzleData, onComplete }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState(puzzleData.dropZones || []);
  const [dragItems, setDragItems] = useState(puzzleData.dragItems || []);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropZone) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Check if the drop is correct
    const isCorrect = draggedItem.correctZone === dropZone.id;
    
    // Update drop zone
    const updatedDropZones = dropZones.map(zone => 
      zone.id === dropZone.id 
        ? { ...zone, item: draggedItem, isCorrect }
        : zone
    );
    
    // Remove item from drag items
    const updatedDragItems = dragItems.filter(item => item.id !== draggedItem.id);
    
    setDropZones(updatedDropZones);
    setDragItems(updatedDragItems);
    setDraggedItem(null);
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Check if puzzle is complete
    if (updatedDragItems.length === 0) {
      setCompleted(true);
      onComplete && onComplete(score + (isCorrect ? 1 : 0), dropZones.length);
    }
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-header">
        <h3>{puzzleData.title}</h3>
        <p>{puzzleData.instructions}</p>
        <div className="puzzle-score">
          Score: {score}/{dropZones.length}
        </div>
      </div>

      <div className="puzzle-content">
        {/* Drag Items */}
        <div className="drag-items-container">
          <h4>Drag Items:</h4>
          <div className="drag-items">
            {dragItems.map(item => (
              <div
                key={item.id}
                className="drag-item"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                style={{ backgroundColor: item.color }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="drop-zones-container">
          <h4>Drop Zones:</h4>
          <div className="drop-zones">
            {dropZones.map(zone => (
              <div
                key={zone.id}
                className={`drop-zone ${zone.isCorrect ? 'correct' : zone.isCorrect === false ? 'incorrect' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, zone)}
              >
                {zone.item ? (
                  <div className="dropped-item" style={{ backgroundColor: zone.item.color }}>
                    {zone.item.content}
                  </div>
                ) : (
                  <div className="drop-zone-placeholder">
                    {zone.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {completed && (
        <div className="puzzle-completion">
          <h3>🎉 Puzzle Complete!</h3>
          <p>You scored {score} out of {dropZones.length}!</p>
        </div>
      )}
    </div>
  );
};

export default DragDropPuzzle;
