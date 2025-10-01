import React from 'react';

const Analytics = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>View detailed performance analytics and reports</p>
      </div>
      <div className="coming-soon">
        <div className="coming-soon-icon">📊</div>
        <h2>Analytics Dashboard</h2>
        <p>Comprehensive analytics and reporting for your classes and students.</p>
        <div className="features-list">
          <div className="feature-item">✓ Class performance metrics</div>
          <div className="feature-item">✓ Student progress tracking</div>
          <div className="feature-item">✓ Lesson completion rates</div>
          <div className="feature-item">✓ Badge achievement statistics</div>
          <div className="feature-item">✓ Exportable reports</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

