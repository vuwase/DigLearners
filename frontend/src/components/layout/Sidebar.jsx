import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ user, onLogout, isOpen, onClose }) => {
  const getNavigationItems = (role) => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', exact: true }
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { path: '/dashboard/users', label: 'User Management' },
          { path: '/dashboard/content', label: 'Content Management' },
          { path: '/dashboard/analytics', label: 'Analytics' },
          { path: '/dashboard/settings', label: 'Settings' },
          { path: '/dashboard/reports', label: 'Reports' }
        ];
      
      case 'teacher':
        return [
          ...baseItems,
          { path: '/dashboard/classes', label: 'My Classes' },
          { path: '/dashboard/students', label: 'Students' },
          { path: '/dashboard/lessons', label: 'Lessons' },
          { path: '/dashboard/assignments', label: 'Assignments' },
          { path: '/dashboard/analytics', label: 'Analytics' },
          { path: '/dashboard/schedule', label: 'Schedule' }
        ];
      
      case 'learner':
        return [
          ...baseItems,
          { path: '/dashboard/lessons', label: 'My Lessons' },
          { path: '/dashboard/progress', label: 'Progress' },
          { path: '/dashboard/achievements', label: 'Badges' },
          { path: '/dashboard/assignments', label: 'Assignments' },
          { path: '/dashboard/leaderboard', label: 'Leaderboard' }
        ];
      
      case 'parent':
        return [
          ...baseItems,
          { path: '/dashboard/children', label: 'My Children' },
          { path: '/dashboard/progress', label: 'Progress Reports' },
          { path: '/dashboard/achievements', label: 'Achievements' },
          { path: '/dashboard/schedule', label: 'Schedule' },
          { path: '/dashboard/communication', label: 'Communication' },
          { path: '/dashboard/reports', label: 'Reports' }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems(user?.role);

  const handleNavClick = () => {
    // Close sidebar on mobile when a navigation item is clicked
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header-top">
          <h2>DigLearners</h2>
          <button 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <p className="user-info">
          <span className="user-name">{user?.fullName || 'User'}</span>
          <span className="user-role">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</span>
        </p>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.exact}
                onClick={handleNavClick}
              >
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

