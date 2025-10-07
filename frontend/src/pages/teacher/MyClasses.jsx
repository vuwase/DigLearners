import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import { getMyClassesData } from '../../services/teacherMockDataService';
import Icon from '../../components/icons/Icon';
import '../../components/DashboardStyles.css';

const MyClasses = () => {
  const { t, currentLanguage } = useTranslation();
  const data = getMyClassesData();
  const [selectedClass, setSelectedClass] = useState(data.classes[0].id);

  const currentClass = data.classes.find(cls => cls.id === selectedClass);

  return (
    <div className="dashboard-container">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>
              {currentLanguage === 'rw' 
                ? 'Amashuri Yange' 
                : 'My Classes'
              }
            </h1>
            <p>
              {currentLanguage === 'rw'
                ? 'Genzura amashuri yose n\'abanyeshuri bawe'
                : 'Manage all your classes and students'
              }
            </p>
          </div>
        </div>

        {/* Class Selector */}
        <div className="class-selector">
          <h3>
            {currentLanguage === 'rw' ? 'Hitamo Ishuuri' : 'Select Class'}
          </h3>
          <div className="class-tabs">
            {data.classes.map((cls) => (
              <button
                key={cls.id}
                className={`class-tab ${selectedClass === cls.id ? 'active' : ''}`}
                onClick={() => setSelectedClass(cls.id)}
              >
                <div className="class-info">
                  <span className="class-name">{cls.name}</span>
                  <span className="class-subject">{cls.subject}</span>
                </div>
                <div className="class-stats">
                  <span>{cls.activeStudents}/{cls.totalStudents} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}</span>
                  <span>{cls.averageProgress}% {currentLanguage === 'rw' ? 'imikurire' : 'progress'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Class Details */}
        {currentClass && (
          <div className="class-details">
            <div className="class-header">
              <div className="class-info">
                <h2>{currentClass.name}</h2>
                <p>{currentClass.description}</p>
                <div className="class-meta">
                  <span>
                    <Icon name="calendar" size={16} style={{ marginRight: '4px' }} />
                    {currentClass.schedule}
                  </span>
                  <span>
                    <Icon name="school" size={16} style={{ marginRight: '4px' }} />
                    {currentClass.classroom}
                  </span>
                  <span>
                    <Icon name="users" size={16} style={{ marginRight: '4px' }} />
                    {currentClass.totalStudents} {currentLanguage === 'rw' ? 'abanyeshuri' : 'students'}
                  </span>
                </div>
              </div>
              <div className="class-progress">
                <div className="progress-circle-large">
                  <span>{currentClass.averageProgress}%</span>
                </div>
                <p>
                  {currentLanguage === 'rw' ? 'Imikurire Ryose' : 'Overall Progress'}
                </p>
              </div>
            </div>

            {/* Class Statistics */}
            <div className="class-stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="users" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{currentClass.totalStudents}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Abanyeshuri Byose' : 'Total Students'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="check" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{currentClass.activeStudents}</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Bakora' : 'Active Students'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="analytics" size={24} />
                </div>
                <div className="stat-content">
                  <h3>{currentClass.averageProgress}%</h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Imikurire Ryose' : 'Average Progress'}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="calendar" size={24} />
                </div>
                <div className="stat-content">
                  <h3>
                    {new Date(currentClass.nextLesson).toLocaleDateString()}
                  </h3>
                  <p>
                    {currentLanguage === 'rw' ? 'Isomo Rikurikira' : 'Next Lesson'}
                  </p>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="students-section">
              <h3>
                {currentLanguage === 'rw' ? 'Abanyeshuri' : 'Students'}
              </h3>
              <div className="students-grid">
                {currentClass.students.map((student) => (
                  <div key={student.id} className="student-card">
                    <div className="student-header">
                      <div className="student-avatar">{student.avatar}</div>
                      <div className="student-info">
                        <h4>{student.name}</h4>
                        <p>{currentLanguage === 'rw' ? 'Imikurire:' : 'Progress:'} {student.progress}%</p>
                      </div>
                      <div className="student-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="student-stats">
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Ibyo yatangije:' : 'Assignments:'}
                        </span>
                        <span className="stat-value">{student.completed}/{student.assignments}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">
                          {currentLanguage === 'rw' ? 'Ikorwa ryanyuma:' : 'Last active:'}
                        </span>
                        <span className="stat-value">{student.lastActive}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                <Icon name="school" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalClasses}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Amashuri Byose' : 'Total Classes'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="users" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.totalStudents}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Abanyeshuri Byose' : 'Total Students'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="check" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.activeStudents}</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Bakora' : 'Active Students'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Icon name="analytics" size={24} />
              </div>
              <div className="stat-content">
                <h3>{data.summary.averageProgress}%</h3>
                <p>
                  {currentLanguage === 'rw' ? 'Imikurire Ryose' : 'Average Progress'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClasses;