// Puzzle Creator Component for Teachers
import React, { useState } from 'react';
import DragDropPuzzle from './DragDropPuzzle';
import MatchingPuzzle from './MatchingPuzzle';
import SequencingPuzzle from './SequencingPuzzle';
import './PuzzleStyles.css';
import '../../pages/teacher/PuzzleCreatorStyles.css';

const PuzzleCreator = ({ onSave, onCancel }) => {
  const [puzzleType, setPuzzleType] = useState('drag-drop');
  const [puzzleData, setPuzzleData] = useState({
    title: '',
    instructions: '',
    type: 'drag-drop',
    items: [],
    correctSequence: [],
    dropZones: [],
    dragItems: [],
    leftItems: [],
    rightItems: []
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handlePuzzleTypeChange = (type) => {
    setPuzzleType(type);
    setPuzzleData(prev => ({ ...prev, type }));
  };

  const handleInputChange = (field, value) => {
    setPuzzleData(prev => ({ ...prev, [field]: value }));
  };

  const addDragDropItem = () => {
    const newItem = {
      id: Date.now(),
      content: '',
      color: '#FF677D',
      correctZone: ''
    };
    setPuzzleData(prev => ({
      ...prev,
      dragItems: [...prev.dragItems, newItem]
    }));
  };

  const addDropZone = () => {
    const newZone = {
      id: Date.now(),
      label: '',
      item: null,
      isCorrect: null
    };
    setPuzzleData(prev => ({
      ...prev,
      dropZones: [...prev.dropZones, newZone]
    }));
  };

  const addMatchingItem = (side) => {
    const newItem = {
      id: Date.now(),
      content: '',
      pairId: Date.now()
    };
    
    if (side === 'left') {
      setPuzzleData(prev => ({
        ...prev,
        leftItems: [...prev.leftItems, newItem]
      }));
    } else {
      setPuzzleData(prev => ({
        ...prev,
        rightItems: [...prev.rightItems, newItem]
      }));
    }
  };

  const addSequenceItem = () => {
    const newItem = {
      id: Date.now(),
      content: ''
    };
    setPuzzleData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      correctSequence: [...prev.correctSequence, newItem]
    }));
  };

  const updateItem = (itemId, field, value, arrayName) => {
    setPuzzleData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (itemId, arrayName) => {
    setPuzzleData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter(item => item.id !== itemId)
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(puzzleData);
    }
  };

  const renderPuzzlePreview = () => {
    switch (puzzleType) {
      case 'drag-drop':
        return <DragDropPuzzle puzzleData={puzzleData} />;
      case 'matching':
        return <MatchingPuzzle puzzleData={puzzleData} />;
      case 'sequencing':
        return <SequencingPuzzle puzzleData={puzzleData} />;
      default:
        return <div>Select a puzzle type to preview</div>;
    }
  };

  const renderPuzzleForm = () => {
    switch (puzzleType) {
      case 'drag-drop':
        return (
          <div className="puzzle-form">
            <h3>Drag & Drop Puzzle Setup</h3>
            
            {/* Drag Items */}
            <div className="form-section">
              <h4>Drag Items</h4>
              {puzzleData.dragItems.map((item, index) => (
                <div key={item.id} className="form-item">
                  <input
                    type="text"
                    placeholder="Item content"
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value, 'dragItems')}
                  />
                  <input
                    type="color"
                    value={item.color}
                    onChange={(e) => updateItem(item.id, 'color', e.target.value, 'dragItems')}
                  />
                  <select
                    value={item.correctZone}
                    onChange={(e) => updateItem(item.id, 'correctZone', e.target.value, 'dragItems')}
                  >
                    <option value="">Select correct zone</option>
                    {puzzleData.dropZones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.label}</option>
                    ))}
                  </select>
                  <button onClick={() => removeItem(item.id, 'dragItems')}>Remove</button>
                </div>
              ))}
              <button onClick={addDragDropItem}>Add Drag Item</button>
            </div>

            {/* Drop Zones */}
            <div className="form-section">
              <h4>Drop Zones</h4>
              {puzzleData.dropZones.map((zone, index) => (
                <div key={zone.id} className="form-item">
                  <input
                    type="text"
                    placeholder="Zone label"
                    value={zone.label}
                    onChange={(e) => updateItem(zone.id, 'label', e.target.value, 'dropZones')}
                  />
                  <button onClick={() => removeItem(zone.id, 'dropZones')}>Remove</button>
                </div>
              ))}
              <button onClick={addDropZone}>Add Drop Zone</button>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="puzzle-form">
            <h3>Matching Puzzle Setup</h3>
            
            {/* Left Items */}
            <div className="form-section">
              <h4>Left Side Items</h4>
              {puzzleData.leftItems.map((item, index) => (
                <div key={item.id} className="form-item">
                  <input
                    type="text"
                    placeholder="Left item"
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value, 'leftItems')}
                  />
                  <button onClick={() => removeItem(item.id, 'leftItems')}>Remove</button>
                </div>
              ))}
              <button onClick={() => addMatchingItem('left')}>Add Left Item</button>
            </div>

            {/* Right Items */}
            <div className="form-section">
              <h4>Right Side Items</h4>
              {puzzleData.rightItems.map((item, index) => (
                <div key={item.id} className="form-item">
                  <input
                    type="text"
                    placeholder="Right item"
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value, 'rightItems')}
                  />
                  <button onClick={() => removeItem(item.id, 'rightItems')}>Remove</button>
                </div>
              ))}
              <button onClick={() => addMatchingItem('right')}>Add Right Item</button>
            </div>
          </div>
        );

      case 'sequencing':
        return (
          <div className="puzzle-form">
            <h3>Sequencing Puzzle Setup</h3>
            
            <div className="form-section">
              <h4>Sequence Items (in correct order)</h4>
              {puzzleData.items.map((item, index) => (
                <div key={item.id} className="form-item">
                  <span>{index + 1}.</span>
                  <input
                    type="text"
                    placeholder="Sequence item"
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value, 'items')}
                  />
                  <button onClick={() => removeItem(item.id, 'items')}>Remove</button>
                </div>
              ))}
              <button onClick={addSequenceItem}>Add Sequence Item</button>
            </div>
          </div>
        );

      default:
        return <div>Select a puzzle type</div>;
    }
  };

  return (
    <div className="puzzle-creator">
      <div className="creator-header">
        <h2>Create Puzzle Lesson</h2>
        <div className="creator-controls">
          <button 
            className={previewMode ? 'active' : ''} 
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="creator-content">
          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <input
              type="text"
              placeholder="Puzzle Title"
              value={puzzleData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <textarea
              placeholder="Instructions for students"
              value={puzzleData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              rows="3"
            />
          </div>

          {/* Puzzle Type Selection */}
          <div className="form-section">
            <h3>Puzzle Type</h3>
            <div className="puzzle-type-selector">
              <button 
                className={puzzleType === 'drag-drop' ? 'active' : ''}
                onClick={() => handlePuzzleTypeChange('drag-drop')}
              >
                🎯 Drag & Drop
              </button>
              <button 
                className={puzzleType === 'matching' ? 'active' : ''}
                onClick={() => handlePuzzleTypeChange('matching')}
              >
                🔗 Matching
              </button>
              <button 
                className={puzzleType === 'sequencing' ? 'active' : ''}
                onClick={() => handlePuzzleTypeChange('sequencing')}
              >
                📋 Sequencing
              </button>
            </div>
          </div>

          {/* Puzzle-specific form */}
          {renderPuzzleForm()}

          {/* Save/Cancel */}
          <div className="creator-actions">
            <button onClick={onCancel} className="cancel-btn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save Puzzle</button>
          </div>
        </div>
      ) : (
        <div className="puzzle-preview">
          {renderPuzzlePreview()}
        </div>
      )}
    </div>
  );
};

export default PuzzleCreator;
