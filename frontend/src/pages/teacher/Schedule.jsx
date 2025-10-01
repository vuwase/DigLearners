import React from 'react';

const Schedule = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Schedule</h1>
        <p>Manage your teaching schedule and deadlines</p>
      </div>
      <div className="coming-soon">
        <div className="coming-soon-icon">📅</div>
        <h2>Schedule Management</h2>
        <p>Organize your teaching schedule and track important deadlines.</p>
        <div className="features-list">
          <div className="feature-item">✓ Calendar view</div>
          <div className="feature-item">✓ Class schedules</div>
          <div className="feature-item">✓ Assignment deadlines</div>
          <div className="feature-item">✓ Lesson planning</div>
          <div className="feature-item">✓ Reminder notifications</div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

