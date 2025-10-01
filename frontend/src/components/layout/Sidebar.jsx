import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
  const getNavigationItems = (role) => {
    const baseItems = [
      { path: '/dashboard', icon: '🏠', label: 'Dashboard', exact: true }
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { path: '/dashboard/users', icon: '👥', label: 'User Management' },
          { path: '/dashboard/content', icon: '📚', label: 'Content Management' },
          { path: '/dashboard/analytics', icon: '📊', label: 'Analytics' },
          { path: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
          { path: '/dashboard/reports', icon: '📋', label: 'Reports' }
        ];
      
      case 'teacher':
        return [
          ...baseItems,
          { path: '/dashboard/classes', icon: '🏫', label: 'My Classes' },
          { path: '/dashboard/students', icon: '👨‍🎓', label: 'Students' },
          { path: '/dashboard/lessons', icon: '📖', label: 'Lessons' },
          { path: '/dashboard/assignments', icon: '📝', label: 'Assignments' },
          { path: '/dashboard/analytics', icon: '📊', label: 'Analytics' },
          { path: '/dashboard/schedule', icon: '📅', label: 'Schedule' }
        ];
      
      case 'learner':
        return [
          ...baseItems,
          { path: '/dashboard/lessons', icon: '📚', label: 'My Lessons' },
          { path: '/dashboard/progress', icon: '📈', label: 'Progress' },
          { path: '/dashboard/badges', icon: '🏆', label: 'Badges' },
          { path: '/dashboard/assignments', icon: '📝', label: 'Assignments' },
          { path: '/dashboard/leaderboard', icon: '🥇', label: 'Leaderboard' },
          { path: '/dashboard/achievements', icon: '⭐', label: 'Achievements' }
        ];
      
      case 'parent':
        return [
          ...baseItems,
          { path: '/dashboard/children', icon: '👶', label: 'My Children' },
          { path: '/dashboard/progress', icon: '📊', label: 'Progress Reports' },
          { path: '/dashboard/achievements', icon: '🏆', label: 'Achievements' },
          { path: '/dashboard/schedule', icon: '📅', label: 'Schedule' },
          { path: '/dashboard/communication', icon: '💬', label: 'Communication' },
          { path: '/dashboard/reports', icon: '📋', label: 'Reports' }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems(user?.role);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>DigLearners</h2>
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
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

