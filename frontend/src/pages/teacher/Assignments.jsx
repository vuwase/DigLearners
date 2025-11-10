import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import teacherApiService from '../../services/teacherApiService';
import Icon from '../../components/icons/Icon';
import PuzzleCreator from '../../components/puzzles/PuzzleCreator';
import '../../components/DashboardStyles.css';
import './PuzzleCreatorStyles.css';
import './TeacherStyles.css';

const Assignments = () => {
  const { t, currentLanguage } = useTranslation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    subject: '',
    grade: '',
    content: '',
    description: '',
    difficulty: 'beginner',
    estimatedDuration: '',
    dueDate: '',
    assignmentType: 'lesson',
    puzzleType: '',
    instructions: []
  });
  const [showPuzzleCreator, setShowPuzzleCreator] = useState(false);
  const [puzzleData, setPuzzleData] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [filterStatus]);

  const parseArrayField = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await teacherApiService.getAssignments({
        status: filterStatus
      });
      const assignmentsData = response.assignments || response.data?.assignments || response.data || [];
      const normalizedAssignments = Array.isArray(assignmentsData) ? assignmentsData : [];
      setAssignments(normalizedAssignments);
      if (normalizedAssignments.length > 0 && !selectedAssignment) {
        setSelectedAssignment(normalizedAssignments[0].id);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentAssignment = assignments.find(assign => assign.id === selectedAssignment);
  
  const filteredAssignments = assignments.filter(assign => {
    const statusMatch = filterStatus === 'all' || assign.status === filterStatus;
    return statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#FF9800';
      case 'completed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', text: 'Overdue', color: '#F44336' };
    if (diffDays === 0) return { status: 'due-today', text: 'Due Today', color: '#FF9800' };
    if (diffDays <= 3) return { status: 'due-soon', text: 'Due Soon', color: '#FF9800' };
    return { status: 'upcoming', text: 'Upcoming', color: '#4CAF50' };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const assignmentData = {
        ...createForm,
        content: puzzleData ? JSON.stringify(puzzleData) : createForm.content
      };
      await teacherApiService.createAssignment(assignmentData);
      setShowCreateModal(false);
      setShowPuzzleCreator(false);
      setPuzzleData(null);
      setCreateForm({
        title: '',
        subject: '',
        grade: '',
        content: '',
        description: '',
        difficulty: 'beginner',
        estimatedDuration: '',
        dueDate: '',
        assignmentType: 'lesson',
        puzzleType: '',
        instructions: []
      });
      fetchAssignments();
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err.message);
    }
  };

  const handlePuzzleSave = (puzzle) => {
    setPuzzleData(puzzle);
    setShowPuzzleCreator(false);
  };

  const handleCreatePuzzle = () => {
    setShowPuzzleCreator(true);
    setCreateForm(prev => ({ ...prev, assignmentType: 'puzzle' }));
  };

  return (
    <div className="dashboard-container assignments-page">
    <div className="page-container">
      <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Ibyo Biteganyijwe' 
                : 'Assignments'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura ibyo biteganyijwe n\'ibyatangijwe'
                : 'Manage assignments and track submissions'
              }
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="quick-actions-header">
            <h3>
              {currentLanguage === 'rw' ? 'Ikorwa Ryihuse' : 'Quick Actions'}
            </h3>
            <p>
              {currentLanguage === 'rw' 
                ? 'Tangiza ibyo biteganyijwe bishya cyangwa genzura ibyatangijwe'
                : 'Create new assignments or manage existing ones'
              }
            </p>
          </div>
          <div className="quick-actions-buttons">
            <button className="quick-action-btn primary">
              <div className="action-icon">➕</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Tangiza Icyo Biteganyijwe' : 'Create Assignment'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Tangiza ibyo biteganyijwe bishya' : 'Create new assignment for students'}
                </span>
              </div>
            </button>
            <button className="quick-action-btn secondary">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Raporo' : 'View Reports'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Reba raporo y\'imikurire' : 'View assignment performance reports'}
                </span>
              </div>
            </button>
            <button className="quick-action-btn secondary">
              <div className="action-icon">📋</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Genzura' : 'Grade Submissions'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Genzura ibyatangijwe' : 'Review and grade student submissions'}
                </span>
              </div>
            </button>
            <button className="quick-action-btn secondary" onClick={handleCreatePuzzle}>
              <div className="action-icon">🧩</div>
              <div className="action-content">
                <span className="action-title">
                  {currentLanguage === 'rw' ? 'Tangiza Puzzle' : 'Create Puzzle'}
                </span>
                <span className="action-subtitle">
                  {currentLanguage === 'rw' ? 'Tangiza puzzle ry\'amahugurwa' : 'Create interactive puzzle lessons'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>
              {currentLanguage === 'rw' ? 'Hitamo Imiterere:' : 'Filter by Status:'}
            </label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">
                {currentLanguage === 'rw' ? 'Byose' : 'All Status'}
              </option>
              <option value="active">
                {currentLanguage === 'rw' ? 'Bikora' : 'Active'}
              </option>
              <option value="upcoming">
                {currentLanguage === 'rw' ? 'Bitegereje' : 'Upcoming'}
              </option>
              <option value="completed">
                {currentLanguage === 'rw' ? 'Byarangije' : 'Completed'}
              </option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading assignments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <p>Error loading assignments: {error}</p>
            <button onClick={fetchAssignments} className="action-btn primary">
              Retry
            </button>
          </div>
        )}

        {/* Assignments Grid */}
        {!loading && !error && (
          <div className="assignments-grid">
            {filteredAssignments.length === 0 ? (
              <div className="no-assignments">
                <h3>No assignments found</h3>
                <p>Create your first assignment to get started!</p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
            const dueStatus = assignment.dueDate ? getDueDateStatus(assignment.dueDate) : { status: 'upcoming', text: currentLanguage === 'rw' ? 'Bitegereje' : 'Upcoming', color: '#4CAF50' };
            return (
              <div 
                key={assignment.id} 
                className={`assignment-card ${selectedAssignment === assignment.id ? 'selected' : ''}`}
                onClick={() => setSelectedAssignment(assignment.id)}
              >
                <div className="assignment-header">
                  <div className="assignment-title">
                    <h4>{assignment.title || 'Untitled Assignment'}</h4>
                    <p>{assignment.class || assignment.grade || 'No class assigned'}</p>
                  </div>
                  <div className="assignment-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(assignment.status) }}
                    >
                      {assignment.status}
                    </span>
                    <span 
                      className="due-status"
                      style={{ color: dueStatus.color }}
                    >
                      {dueStatus.text}
                    </span>
                  </div>
                </div>
                
                <div className="assignment-meta">
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Igihe cyo gusubira:' : 'Due Date:'}
                    </span>
                    <span className="meta-value">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '—'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Abanyeshuri:' : 'Students:'}
                    </span>
                    <span className="meta-value">{assignment.submitted || 0}/{assignment.totalStudents || 0}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">
                      {currentLanguage === 'rw' ? 'Yatangijwe:' : 'Graded:'}
                    </span>
                    <span className="meta-value">{assignment.graded || 0}/{assignment.submitted || 0}</span>
                  </div>
                  {assignment.averageScore > 0 && (
                    <div className="meta-item">
                      <span className="meta-label">
                        {currentLanguage === 'rw' ? 'Incamake ryose:' : 'Average Score:'}
                      </span>
                      <span className="meta-value">{assignment.averageScore ?? 0}%</span>
                    </div>
                  )}
                </div>

                <div className="assignment-progress">
                  <div className="progress-bar">
                    <div 
                    className="progress-fill" 
                    style={{ width: `${assignment.totalStudents ? Math.min(100, (assignment.submitted || 0) / assignment.totalStudents * 100) : 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {assignment.submitted || 0}/{assignment.totalStudents || 0} {currentLanguage === 'rw' ? 'yatangije' : 'submitted'}
                  </span>
                </div>
              </div>
            );
          })
            )}
          </div>
        )}

        {/* Selected Assignment Details */}
        {currentAssignment && !loading && !error && (
          <div className="assignment-details">
            <div className="assignment-detail-header">
              <div className="assignment-info">
                <h2>{currentAssignment.title || 'Untitled Assignment'}</h2>
                <p>{currentAssignment.class || currentAssignment.grade || 'No class assigned'}</p>
                <div className="assignment-meta-detail">
                  <span>
                    <Icon name="calendar" size={16} style={{ marginRight: '4px' }} />
                    {currentAssignment.dueDate ? new Date(currentAssignment.dueDate).toLocaleDateString() : 'No due date'}
                  </span>
                  <span>
                    <Icon name="users" size={16} style={{ marginRight: '4px' }} />
                    {currentAssignment.totalStudents || 0} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}
                  </span>
                  <span>
                    <Icon name="check" size={16} style={{ marginRight: '4px' }} />
                    {currentAssignment.submitted || 0} {currentLanguage === 'rw' ? 'yatangije' : 'submitted'}
                  </span>
                </div>
              </div>
              <div className="assignment-actions">
                <button className="action-btn primary">
                  {currentLanguage === 'rw' ? 'Guhindura' : 'Edit'}
                </button>
                <button className="action-btn secondary">
                  {currentLanguage === 'rw' ? 'Gusohora' : 'Publish'}
                </button>
                <button className="action-btn danger">
                  {currentLanguage === 'rw' ? 'Gusiba' : 'Delete'}
                </button>
              </div>
            </div>

            <div className="assignment-sections">
              <div className="description-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibisobanuro' : 'Description'}
                </h3>
                <p>{currentAssignment.description || 'No description available'}</p>
              </div>

              <div className="instructions-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Amabwiriza' : 'Instructions'}
                </h3>
                <ol>
                  {parseArrayField(currentAssignment.instructions).map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="submissions-section">
                <h3>
                  {currentLanguage === 'rw' ? 'Ibyatangijwe' : 'Submissions'}
                </h3>
                <div className="submissions-list">
                  {parseArrayField(currentAssignment.submissions).map((submission, index) => (
                    <div key={index} className="submission-item">
                      <div className="submission-header">
                        <span className="student-name">{submission.studentName}</span>
                        <span className="submission-date">{submission.submittedDate}</span>
                      </div>
                      <div className="submission-status">
                        <span 
                          className={`status-badge ${submission.status}`}
                          style={{ 
                            backgroundColor: submission.status === 'graded' ? '#4CAF50' : '#FF9800' 
                          }}
                        >
                          {submission.status}
                        </span>
                        {submission.score && (
                          <span className="submission-score">{submission.score}%</span>
                        )}
                      </div>
                      {submission.feedback && (
                        <div className="submission-feedback">
                          <p>{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-stats">
          <h3>
            {currentLanguage === 'rw' ? 'Incamake' : 'Summary'}
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="assignment" size={24} />
              </div>
              <div className="stat-content">
                <h3>{assignments.length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ibyo Biteganyijwe Byose' : 'Total Assignments'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="check" size={24} />
              </div>
              <div className="stat-content">
                <h3>{assignments.filter(a => a.status === 'active').length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bikora' : 'Active'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="calendar" size={24} />
              </div>
              <div className="stat-content">
                <h3>{assignments.filter(a => a.status === 'upcoming').length}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bitegereje' : 'Upcoming'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="analytics" size={24} />
              </div>
              <div className="stat-content">
                <h3>{assignments.reduce((sum, a) => sum + (a.submissions || 0), 0)}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Ibyatangijwe Byose' : 'Total Submissions'}
                </p>
      </div>
        </div>
      </div>
        </div>
        {/* Puzzle Creator Modal */}
        {showPuzzleCreator && (
          <div className="modal-overlay">
            <div className="modal-content puzzle-creator-modal">
              <PuzzleCreator 
                onSave={handlePuzzleSave}
                onCancel={() => setShowPuzzleCreator(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
