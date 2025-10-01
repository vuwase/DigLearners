import React from 'react';

const Assignments = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Assignments</h1>
        <p>Track assignment completion and grades</p>
      </div>
      <div className="coming-soon">
        <div className="coming-soon-icon">📝</div>
        <h2>Assignments Management</h2>
        <p>This feature will allow you to create, assign, and track student assignments.</p>
        <div className="features-list">
          <div className="feature-item">✓ Create new assignments</div>
          <div className="feature-item">✓ Assign to specific classes</div>
          <div className="feature-item">✓ Track completion status</div>
          <div className="feature-item">✓ Grade student work</div>
          <div className="feature-item">✓ Generate assignment reports</div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;

