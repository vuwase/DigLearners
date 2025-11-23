import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import teacherApiService from '../../services/teacherApiService';
import gamifiedApiService from '../../services/gamifiedApiService';
import '../../components/DashboardStyles.css';

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChildRegistration, setShowChildRegistration] = useState(false);
  const [childForm, setChildForm] = useState({
    fullName: '',
    grade: '',
    age: ''
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [showLessonUpload, setShowLessonUpload] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    grade: '',
    ageGroup: '',
    subject: '',
    gameType: 'interactive',
    difficulty: 'beginner',
    content: '',
    instructions: '',
    learningObjectives: '',
    estimatedTime: 10,
    pointsReward: 10,
    badgeReward: ''
  });
  const [lessonUploadLoading, setLessonUploadLoading] = useState(false);
  const [lessonUploadMessage, setLessonUploadMessage] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    grade: '',
    age: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchStudents();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await teacherApiService.getDashboardData();
      const dashboard = response.data || response;
      setDashboardData(dashboard);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChildRegistration = async (e) => {
    e.preventDefault();
    setRegistrationLoading(true);
    setRegistrationMessage('');

    try {
      const response = await teacherApiService.makeRequest('/teacher/register-student', {
        method: 'POST',
        body: JSON.stringify({
          fullName: childForm.fullName.trim(),
          grade: childForm.grade,
          age: childForm.age ? parseInt(childForm.age) : null
        })
      });

      if (response.success) {
        const successMsg = response.data?.registrationCode 
          ? `Student registered successfully! Registration Code: ${response.data.registrationCode}`
          : 'Student registered successfully!';
        setRegistrationMessage(successMsg);
        setChildForm({
          fullName: '',
          grade: '',
          age: ''
        });
        setShowChildRegistration(false);
        // Refresh dashboard data and students list to show new student
        fetchDashboardData();
        fetchStudents();
      } else {
        setRegistrationMessage(`Error: ${response.error || 'Registration failed'}`);
      }
    } catch (err) {
      setRegistrationMessage(`Error: ${err.message}`);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChildForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLessonUpload = async (e) => {
    e.preventDefault();
    setLessonUploadLoading(true);
    setLessonUploadMessage('');

    try {
      const response = await gamifiedApiService.createContent(lessonForm);
      setLessonUploadMessage('Lesson created successfully!');
      setLessonForm({
        title: '',
        description: '',
        grade: '',
        ageGroup: '',
        subject: '',
        gameType: 'interactive',
        difficulty: 'beginner',
        content: '',
        instructions: '',
        learningObjectives: '',
        estimatedTime: 10,
        pointsReward: 10,
        badgeReward: ''
      });
      setShowLessonUpload(false);
    } catch (err) {
      setLessonUploadMessage(`Error: ${err.message}`);
    } finally {
      setLessonUploadLoading(false);
    }
  };

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setLessonForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchStudents = async () => {
    try {
      const response = await teacherApiService.getStudents();
      const studentList = response.students || response.data || [];
      setStudents(Array.isArray(studentList) ? studentList : []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditForm({
      fullName: student.fullName,
      email: student.email,
      grade: student.grade || '',
      age: student.age || ''
    });
    setEditMessage('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditMessage('');

    try {
      const response = await teacherApiService.updateStudent(editingStudent.id, editForm);
      setEditMessage('Student updated successfully!');
      setEditingStudent(null);
      fetchStudents(); // Refresh the students list
    } catch (err) {
      setEditMessage(`Error: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setEditForm({
      fullName: '',
      email: '',
      grade: '',
      age: ''
    });
    setEditMessage('');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="page-container">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="page-container">
          <div className="error-message">
            <h2>Error loading dashboard</h2>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentActivity = dashboardData?.recentActivity || [];

  const statCards = [
    {
      icon: 'assignment',
      label: 'Draft Lessons',
      value: stats.draftLessons
    },
    {
      icon: 'student',
      label: 'Total Students',
      value: stats.totalStudents
    },
    {
      icon: 'book',
      label: 'Total Lessons',
      value: stats.totalLessons
    },
    {
      icon: 'progress',
      label: 'Avg Progress',
      value: stats.averageProgress,
      format: (val) => `${val}%`
    }
  ].filter(card => typeof card.value === 'number' && card.value > 0);

  return (
    <div className="dashboard-container">
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Teacher Dashboard</h1>
          <p>Welcome back! Here's an overview of your teaching activities</p>
        </div>
      </div>

      {statCards.length > 0 ? (
        <div className="stats-grid">
          {statCards.map(({ icon, label, value, format }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon">
                <Icon name={icon} size={24} />
              </div>
              <div className="stat-content">
                <h3>{format ? format(value) : value}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stats-empty">
          <h3>No teaching stats yet</h3>
          <p>Once you start adding students, lessons, or progress, your metrics will appear here.</p>
        </div>
      )}

      {/* Child Registration Section */}
      <div className="child-registration-section">
        <div className="section-header">
          <h2>👨‍🎓 Student Management</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowChildRegistration(!showChildRegistration)}
          >
            {showChildRegistration ? 'Cancel' : '+ Register New Student'}
          </button>
        </div>

        {showChildRegistration && (
          <div className="child-registration-form">
            <h3>Register a New Student</h3>
            <form onSubmit={handleChildRegistration}>
              <div className="form-group">
                <label htmlFor="fullName">Student Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={childForm.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter student's full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grade">Grade *</label>
                  <select
                    id="grade"
                    name="grade"
                    value={childForm.grade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age (Optional)</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={childForm.age}
                    onChange={handleInputChange}
                    min="5"
                    max="18"
                    placeholder="Age"
                  />
                </div>
              </div>

              {registrationMessage && (
                <div className={`message ${registrationMessage.includes('Error') ? 'error' : 'success'}`}>
                  {registrationMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-success"
                disabled={registrationLoading}
              >
                {registrationLoading ? 'Registering...' : 'Register Student'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Lesson Upload Section */}
      <div className="lesson-upload-section">
        <div className="section-header">
          <h2>📚 Create Gamified Lessons</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowLessonUpload(!showLessonUpload)}
          >
            {showLessonUpload ? 'Cancel' : '+ Create New Lesson'}
          </button>
        </div>

        {showLessonUpload && (
          <div className="lesson-upload-form">
            <h3>Create a Gamified Lesson</h3>
            <form onSubmit={handleLessonUpload}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lessonTitle">Lesson Title *</label>
                  <input
                    type="text"
                    id="lessonTitle"
                    name="title"
                    value={lessonForm.title}
                    onChange={handleLessonInputChange}
                    required
                    placeholder="Enter lesson title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lessonSubject">Subject *</label>
                  <select
                    id="lessonSubject"
                    name="subject"
                    value={lessonForm.subject}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="Digital Literacy">Digital Literacy</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="Language">Language</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lessonGrade">Target Grade *</label>
                  <select
                    id="lessonGrade"
                    name="grade"
                    value={lessonForm.grade}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lessonAgeGroup">Age Group *</label>
                  <select
                    id="lessonAgeGroup"
                    name="ageGroup"
                    value={lessonForm.ageGroup}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="">Select Age Group</option>
                    <option value="0-2">0-2 (Early Learning)</option>
                    <option value="3-4">3-4 (Pre-K)</option>
                    <option value="5-6">5-6 (Kindergarten)</option>
                    <option value="7+">7+ (Primary School)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lessonGameType">Game Type *</label>
                  <select
                    id="lessonGameType"
                    name="gameType"
                    value={lessonForm.gameType}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="interactive">Interactive</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="quiz">Quiz</option>
                    <option value="story">Story</option>
                    <option value="simulation">Simulation</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lessonDifficulty">Difficulty *</label>
                  <select
                    id="lessonDifficulty"
                    name="difficulty"
                    value={lessonForm.difficulty}
                    onChange={handleLessonInputChange}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lessonDescription">Description *</label>
                <textarea
                  id="lessonDescription"
                  name="description"
                  value={lessonForm.description}
                  onChange={handleLessonInputChange}
                  required
                  rows="3"
                  placeholder="Describe what this lesson teaches..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lessonTime">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    id="lessonTime"
                    name="estimatedTime"
                    value={lessonForm.estimatedTime}
                    onChange={handleLessonInputChange}
                    min="1"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lessonPoints">Points Reward</label>
                  <input
                    type="number"
                    id="lessonPoints"
                    name="pointsReward"
                    value={lessonForm.pointsReward}
                    onChange={handleLessonInputChange}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lessonObjectives">Learning Objectives</label>
                <textarea
                  id="lessonObjectives"
                  name="learningObjectives"
                  value={lessonForm.learningObjectives}
                  onChange={handleLessonInputChange}
                  rows="2"
                  placeholder="What will students learn from this lesson?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lessonInstructions">Instructions</label>
                <textarea
                  id="lessonInstructions"
                  name="instructions"
                  value={lessonForm.instructions}
                  onChange={handleLessonInputChange}
                  rows="2"
                  placeholder="How should students complete this lesson?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lessonContent">Game Content (JSON)</label>
                <textarea
                  id="lessonContent"
                  name="content"
                  value={lessonForm.content}
                  onChange={handleLessonInputChange}
                  rows="4"
                  placeholder='{"gameType": "interactive", "levels": 3, "activities": [...]}'
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={lessonUploadLoading}
                >
                  {lessonUploadLoading ? 'Creating...' : 'Create Lesson'}
                </button>
              </div>

              {lessonUploadMessage && (
                <div className={`message ${lessonUploadMessage.includes('Error') ? 'error' : 'success'}`}>
                  {lessonUploadMessage}
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* User Management Section */}
      <div className="user-management-section">
        <div className="section-header">
          <h2>👥 Student Management</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowUserManagement(!showUserManagement)}
          >
            {showUserManagement ? 'Hide Students' : 'Manage Students'}
          </button>
        </div>

        {showUserManagement && (
          <div className="students-list">
            <h3>All Students ({students.length})</h3>
            <div className="students-grid">
              {students.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-info">
                    <div className="student-avatar">
                      {(student.fullName || student.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="student-details">
                      <h4>{student.fullName || student.name || 'Unknown Student'}</h4>
                      <p className="student-email">{student.email || 'No email provided'}</p>
                      <div className="student-meta">
                        <span className="grade-badge">
                          {student.grade || 'No Grade Set'}
                        </span>
                        {student.age && (
                          <span className="age-badge">Age: {student.age}</span>
                        )}
                      </div>
                      <div className="student-stats">
                        <span>⭐ {student.totalPoints || 0} points</span>
                        <span>📅 Joined: {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="student-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleEditStudent(student)}
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editingStudent && (
              <div className="edit-student-modal">
                <div className="modal-content">
                  <h3>Edit Student Profile</h3>
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="editFullName">Full Name *</label>
                        <input
                          type="text"
                          id="editFullName"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleEditInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="editEmail">Email *</label>
                        <input
                          type="email"
                          id="editEmail"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="editGrade">Grade *</label>
                        <select
                          id="editGrade"
                          name="grade"
                          value={editForm.grade}
                          onChange={handleEditInputChange}
                          required
                        >
                          <option value="">Select Grade</option>
                          <option value="Grade 1">Grade 1</option>
                          <option value="Grade 2">Grade 2</option>
                          <option value="Grade 3">Grade 3</option>
                          <option value="Grade 4">Grade 4</option>
                          <option value="Grade 5">Grade 5</option>
                          <option value="Grade 6">Grade 6</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 8">Grade 8</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="editAge">Age</label>
                        <input
                          type="number"
                          id="editAge"
                          name="age"
                          value={editForm.age}
                          onChange={handleEditInputChange}
                          min="3"
                          max="18"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={editLoading}
                      >
                        {editLoading ? 'Updating...' : 'Update Student'}
                      </button>
                    </div>

                    {editMessage && (
                      <div className={`message ${editMessage.includes('Error') ? 'error' : 'success'}`}>
                        {editMessage}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <Link to="/dashboard/assignments" className="dashboard-card">
          <div className="card-icon">
            <Icon name="assignment" size={32} />
          </div>
          <div className="card-content">
            <h3>Create Work</h3>
            <p>Create assignments and lessons for students</p>
            {(stats.totalAssignments > 0 || stats.pendingAssignments > 0) && (
              <div className="card-stats">
                <span>
                  {stats.totalAssignments || 0} assignments
                  {stats.pendingAssignments > 0 ? ` • ${stats.pendingAssignments} pending` : ''}
                </span>
              </div>
            )}
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/students" className="dashboard-card">
          <div className="card-icon">
            <Icon name="student" size={32} />
          </div>
          <div className="card-content">
            <h3>Students</h3>
            <p>View student progress and performance</p>
            {stats.averageProgress > 0 && (
              <div className="card-stats">
                <span>{stats.averageProgress}% average progress</span>
              </div>
            )}
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/lessons" className="dashboard-card">
          <div className="card-icon">
            <Icon name="book" size={32} />
          </div>
          <div className="card-content">
            <h3>Lessons</h3>
            <p>Create and assign educational content</p>
            {stats.totalLessons > 0 && (
              <div className="card-stats">
                <span>{stats.totalLessons} lessons assigned</span>
              </div>
            )}
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/assignments" className="dashboard-card">
          <div className="card-icon">
            <Icon name="assignment" size={32} />
          </div>
          <div className="card-content">
            <h3>Assignments</h3>
            <p>Track assignment completion and grades</p>
            {stats.pendingReviews > 0 && (
              <div className="card-stats">
                <span>{stats.pendingReviews} pending reviews</span>
              </div>
            )}
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/analytics" className="dashboard-card">
          <div className="card-icon">
            <Icon name="analytics" size={32} />
          </div>
          <div className="card-content">
            <h3>Analytics</h3>
            <p>View detailed performance analytics</p>
            <div className="card-stats">
              <span>Weekly reports available</span>
            </div>
          </div>
          <div className="card-arrow">→</div>
        </Link>
        
        <Link to="/dashboard/schedule" className="dashboard-card">
          <div className="card-icon">
            <Icon name="calendar" size={24} />
          </div>
          <div className="card-content">
            <h3>Schedule</h3>
            <p>Manage your teaching schedule and deadlines</p>
            {stats.upcomingDeadlines > 0 && (
              <div className="card-stats">
                <span>{stats.upcomingDeadlines} upcoming deadlines</span>
              </div>
            )}
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      {/* Student Progress Monitoring Section */}
      <div className="student-progress-section">
        <h2>📊 Student Progress Monitoring</h2>
        <div className="progress-monitoring-grid">
          {students.length > 0 ? (
            // Group students by grade and display progress
            Object.entries(
              students.reduce((groups, student) => {
                const grade = student.grade || 'Ungraded';
                if (!groups[grade]) groups[grade] = [];
                groups[grade].push(student);
                return groups;
              }, {})
            ).map(([grade, gradeStudents]) => {
              const averageProgress = Math.round(
                gradeStudents.reduce((sum, s) => sum + (s.totalPoints || 0), 0) / gradeStudents.length / 10
              );
              const completedLessons = gradeStudents.reduce((sum, s) => sum + (s.completedAssignments || 0), 0);
              
              return (
                <div key={grade} className="progress-card">
                  <div className="progress-header">
                    <h3>👥 {grade} Students</h3>
                    <span className="progress-count">{gradeStudents.length} students</span>
                  </div>
                  <div className="progress-stats">
                    <div className="progress-stat">
                      <span className="stat-number">{averageProgress}%</span>
                      <span className="stat-label">Average Progress</span>
                    </div>
                    <div className="progress-stat">
                      <span className="stat-number">{completedLessons}</span>
                      <span className="stat-label">Lessons Completed</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${averageProgress}%`}}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="progress-empty">
              <h3>👥 No students yet</h3>
              <p>Register learners to start tracking their progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Individual Student Progress */}
      <div className="individual-progress-section">
        <h2>👨‍🎓 Individual Student Progress</h2>
        <div className="student-list">
          {students.length > 0 ? (
            students.slice(0, 5).map((student, index) => {
              const progressPercentage = Math.round((student.totalPoints || 0) / 10);
              const avatar = index % 2 === 0 ? '👦' : '👧';
              const level = progressPercentage >= 80 ? 'Expert' : 
                           progressPercentage >= 60 ? 'Adventurer' : 
                           progressPercentage >= 40 ? 'Explorer' : 'Beginner';
              
              return (
                <div key={student.id} className="student-progress-item">
                  <div className="student-info">
                    <div className="student-avatar">{avatar}</div>
                    <div className="student-details">
                      <h4>{student.fullName}</h4>
                      <p>{student.grade || 'Ungraded'} • {level} Level</p>
                    </div>
                  </div>
                  <div className="student-progress">
                    <div className="progress-stats">
                      <span className="points">⭐ {student.totalPoints || 0} points</span>
                      <span className="lessons">📚 {student.completedAssignments || 0} lessons</span>
                      <span className="badges">🏆 {student.badgesEarned || 0} badges</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="student-progress-empty">
              <h3>No student activity yet</h3>
              <p>Once learners start completing lessons, their progress will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <Icon name="book" size={20} />
                </div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.student?.fullName || activity.student?.name || 'Student'}</strong> completed 
                    <strong> {activity.lesson?.title || 'lesson'}</strong>
                  </p>
                  <span className="activity-time">
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <p>No recent activity</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

