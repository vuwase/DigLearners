import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Lessons = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockLessons = [
      {
        id: 1,
        title: 'Introduction to Computers',
        moduleType: 'basic-computing',
        difficulty: 'beginner',
        estimatedDuration: 45,
        ageGroup: 'P4-P5',
        description: 'Learn the basics of computer hardware and software',
        isActive: true,
        assignedTo: ['Primary 4A', 'Primary 5B'],
        completionRate: 85
      },
      {
        id: 2,
        title: 'Safe Internet Browsing',
        moduleType: 'digital-citizenship',
        difficulty: 'beginner',
        estimatedDuration: 30,
        ageGroup: 'P4-P6',
        description: 'Understanding internet safety and responsible browsing',
        isActive: true,
        assignedTo: ['Primary 4A', 'Primary 5B', 'Primary 6C'],
        completionRate: 92
      },
      {
        id: 3,
        title: 'Introduction to Programming',
        moduleType: 'block-coding',
        difficulty: 'intermediate',
        estimatedDuration: 60,
        ageGroup: 'P5-P6',
        description: 'Basic programming concepts using visual blocks',
        isActive: true,
        assignedTo: ['Primary 5B', 'Primary 6C'],
        completionRate: 78
      },
      {
        id: 4,
        title: 'Typing Fundamentals',
        moduleType: 'typing',
        difficulty: 'beginner',
        estimatedDuration: 40,
        ageGroup: 'P4-P6',
        description: 'Learn proper typing techniques and keyboard layout',
        isActive: true,
        assignedTo: ['Primary 4A', 'Primary 5B', 'Primary 6C'],
        completionRate: 88
      },
      {
        id: 5,
        title: 'Digital Privacy & Security',
        moduleType: 'digital-citizenship',
        difficulty: 'intermediate',
        estimatedDuration: 50,
        ageGroup: 'P5-P6',
        description: 'Understanding personal data protection and online security',
        isActive: true,
        assignedTo: ['Primary 6C'],
        completionRate: 65
      }
    ];
    
    setTimeout(() => {
      setLessons(mockLessons);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLessons = lessons.filter(lesson => {
    const matchesModule = selectedModule === 'all' || lesson.moduleType === selectedModule;
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    return matchesModule && matchesDifficulty;
  });

  const moduleTypes = ['all', ...new Set(lessons.map(l => l.moduleType))];
  const difficulties = ['all', ...new Set(lessons.map(l => l.difficulty))];

  const getModuleIcon = (moduleType) => {
    const icons = {
      'basic-computing': '💻',
      'digital-citizenship': '🛡️',
      'block-coding': '🧩',
      'typing': '⌨️'
    };
    return icons[moduleType] || '📚';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b',
      'advanced': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  const handleAssignLesson = (lessonId) => {
    alert(`Assign lesson ${lessonId} - functionality will be implemented`);
  };

  const handleEditLesson = (lessonId) => {
    alert(`Edit lesson ${lessonId} - functionality will be implemented`);
  };

  const handleCreateLesson = () => {
    alert('Create new lesson - functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Lessons</h1>
          <p>Loading lessons...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Lessons</h1>
          <p>Create and manage educational content for your students</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateLesson}>
          <span className="btn-icon">➕</span>
          Create New Lesson
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="module-filter">Module Type:</label>
          <select 
            id="module-filter"
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
            className="filter-select"
          >
            {moduleTypes.map(module => (
              <option key={module} value={module}>
                {module === 'all' ? 'All Modules' : module.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="difficulty-filter">Difficulty:</label>
          <select 
            id="difficulty-filter"
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{filteredLessons.length}</h3>
            <p>Available Lessons</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{Math.round(filteredLessons.reduce((sum, l) => sum + l.completionRate, 0) / filteredLessons.length || 0)}%</h3>
            <p>Avg Completion</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{Math.round(filteredLessons.reduce((sum, l) => sum + l.estimatedDuration, 0) / filteredLessons.length || 0)}min</h3>
            <p>Avg Duration</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{filteredLessons.reduce((sum, l) => sum + l.assignedTo.length, 0)}</h3>
            <p>Total Assignments</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Lesson Library</h2>
        <div className="lessons-grid">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-header">
                <div className="lesson-icon">
                  {getModuleIcon(lesson.moduleType)}
                </div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p className="lesson-description">{lesson.description}</p>
                </div>
                <div className="lesson-status">
                  <span className={`status-badge ${lesson.isActive ? 'active' : 'inactive'}`}>
                    {lesson.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="lesson-details">
                <div className="detail-row">
                  <span className="detail-label">Module:</span>
                  <span className="detail-value">{lesson.moduleType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Difficulty:</span>
                  <span 
                    className="detail-value difficulty-badge"
                    style={{ color: getDifficultyColor(lesson.difficulty) }}
                  >
                    {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{lesson.estimatedDuration} minutes</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age Group:</span>
                  <span className="detail-value">{lesson.ageGroup}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Completion Rate:</span>
                  <span className="detail-value">{lesson.completionRate}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Assigned to:</span>
                  <span className="detail-value">{lesson.assignedTo.join(', ')}</span>
                </div>
              </div>
              
              <div className="lesson-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleEditLesson(lesson.id)}
                >
                  <span className="btn-icon">✏️</span>
                  Edit
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAssignLesson(lesson.id)}
                >
                  <span className="btn-icon">📤</span>
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;

