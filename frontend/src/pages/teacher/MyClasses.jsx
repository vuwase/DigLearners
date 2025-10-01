import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MyClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockClasses = [
      {
        id: 1,
        name: 'Primary 4A',
        grade: 'P4',
        studentCount: 32,
        description: 'Digital literacy fundamentals for Primary 4',
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'Primary 5B',
        grade: 'P5',
        studentCount: 28,
        description: 'Advanced computer skills for Primary 5',
        isActive: true,
        createdAt: '2024-01-20'
      },
      {
        id: 3,
        name: 'Primary 6C',
        grade: 'P6',
        studentCount: 35,
        description: 'Programming basics and digital citizenship',
        isActive: true,
        createdAt: '2024-02-01'
      }
    ];
    
    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateClass = () => {
    // TODO: Implement create class functionality
    alert('Create Class functionality will be implemented');
  };

  const handleManageClass = (classId) => {
    // TODO: Navigate to class management page
    alert(`Manage class ${classId} - functionality will be implemented`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>My Classes</h1>
          <p>Loading your classes...</p>
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
          <h1>My Classes</h1>
          <p>Manage your learning classes and students</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateClass}>
          <span className="btn-icon">➕</span>
          Create New Class
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>{classes.length}</h3>
            <p>Total Classes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{classes.reduce((sum, cls) => sum + cls.studentCount, 0)}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{classes.length * 12}</h3>
            <p>Lessons Assigned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>85%</h3>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Your Classes</h2>
        <div className="classes-grid">
          {classes.map((classItem) => (
            <div key={classItem.id} className="class-card">
              <div className="class-header">
                <div className="class-info">
                  <h3>{classItem.name}</h3>
                  <p className="class-grade">Grade: {classItem.grade}</p>
                </div>
                <div className="class-status">
                  <span className={`status-badge ${classItem.isActive ? 'active' : 'inactive'}`}>
                    {classItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="class-description">
                <p>{classItem.description}</p>
              </div>
              
              <div className="class-stats">
                <div className="stat">
                  <span className="stat-label">Students:</span>
                  <span className="stat-value">{classItem.studentCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Created:</span>
                  <span className="stat-value">{new Date(classItem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="class-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleManageClass(classItem.id)}
                >
                  <span className="btn-icon">👥</span>
                  Manage Students
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleManageClass(classItem.id)}
                >
                  <span className="btn-icon">📚</span>
                  Assign Lessons
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyClasses;

