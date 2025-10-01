import React from 'react';
import Sidebar from './Sidebar';
import './AppLayout.css';

const AppLayout = ({ user, onLogout, children }) => {
  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

