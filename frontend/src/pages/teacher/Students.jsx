import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        fullName: 'Alice Uwimana',
        email: 'alice.uwimana@student.rw',
        class: 'Primary 4A',
        grade: 'P4',
        progress: 85,
        completedLessons: 12,
        totalLessons: 15,
        badges: 5,
        lastActive: '2024-01-20',
        isActive: true
      },
      {
        id: 2,
        fullName: 'Jean Baptiste Nkurunziza',
        email: 'jean.nkurunziza@student.rw',
        class: 'Primary 4A',
        grade: 'P4',
        progress: 92,
        completedLessons: 14,
        totalLessons: 15,
        badges: 7,
        lastActive: '2024-01-19',
        isActive: true
      },
      {
        id: 3,
        fullName: 'Marie Claire Mukamana',
        email: 'marie.mukamana@student.rw',
        class: 'Primary 5B',
        grade: 'P5',
        progress: 78,
        completedLessons: 9,
        totalLessons: 12,
        badges: 4,
        lastActive: '2024-01-18',
        isActive: true
      },
      {
        id: 4,
        fullName: 'Paul Kagame Jr.',
        email: 'paul.kagame@student.rw',
        class: 'Primary 6C',
        grade: 'P6',
        progress: 95,
        completedLessons: 18,
        totalLessons: 18,
        badges: 12,
        lastActive: '2024-01-20',
        isActive: true
      }
    ];
    
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const classes = ['all', ...new Set(students.map(s => s.class))];

  const getProgressColor = (progress) => {
    if (progress >= 90) return '#10b981'; // green
    if (progress >= 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Students</h1>
          <p>Loading student data...</p>
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
          <h1>Students</h1>
          <p>View and manage student progress across all your classes</p>
        </div>
        <button className="btn btn-primary">
          <span className="btn-icon">📊</span>
          Export Report
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="class-filter">Filter by Class:</label>
          <select 
            id="class-filter"
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>
                {cls === 'all' ? 'All Classes' : cls}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="search">Search Students:</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-content">
            <h3>{filteredStudents.length}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{Math.round(filteredStudents.reduce((sum, s) => sum + s.progress, 0) / filteredStudents.length || 0)}%</h3>
            <p>Average Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{filteredStudents.reduce((sum, s) => sum + s.badges, 0)}</h3>
            <p>Total Badges</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{filteredStudents.filter(s => s.progress >= 90).length}</h3>
            <p>High Performers</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Student Progress</h2>
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Progress</th>
                <th>Lessons</th>
                <th>Badges</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {student.fullName.charAt(0)}
                      </div>
                      <div className="student-details">
                        <div className="student-name">{student.fullName}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="class-badge">{student.class}</span>
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${student.progress}%`,
                            backgroundColor: getProgressColor(student.progress)
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{student.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="lesson-count">
                      {student.completedLessons}/{student.totalLessons}
                    </span>
                  </td>
                  <td>
                    <span className="badge-count">
                      🏆 {student.badges}
                    </span>
                  </td>
                  <td>
                    <span className="last-active">
                      {new Date(student.lastActive).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-secondary" title="View Details">
                        👁️
                      </button>
                      <button className="btn btn-sm btn-primary" title="Send Message">
                        💬
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;

