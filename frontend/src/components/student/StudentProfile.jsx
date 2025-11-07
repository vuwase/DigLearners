// Student Profile Component with Funny Cartoon Avatar
import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './StudentProfile.css';

const StudentProfile = ({ showFullProfile = false }) => {
  const { user } = useAuth();

  // Generate a funny cartoon avatar based on user's name
  const cartoonAvatar = useMemo(() => {
    if (!user?.fullName) return '👤';
    
    // Create a consistent avatar based on the first letter of the name
    const firstLetter = user.fullName.charAt(0).toUpperCase();
    const charCode = firstLetter.charCodeAt(0);
    
    // Fun cartoon avatars based on letter
    const avatars = [
      '😊', '🤗', '😄', '😃', '😁', '😆', '😅', '🤣',
      '😊', '😋', '😎', '🤓', '🧐', '🤩', '🥳', '😇',
      '🤠', '🥸', '😺', '😸', '😹', '😻', '😼', '😽',
      '🙀', '😿', '😾', '🐱', '🐶', '🐭', '🐹', '🐰',
      '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷',
      '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅',
      '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛',
      '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂',
      '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐',
      '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋',
      '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘',
      '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃',
      '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐',
      '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🦤', '🦚',
      '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡',
      '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾'
    ];
    
    // Use modulo to get a consistent avatar for each letter
    const avatarIndex = charCode % avatars.length;
    return avatars[avatarIndex];
  }, [user?.fullName]);

  // Get user stats (if available)
  const userStats = {
    totalPoints: user?.totalPoints || 0,
    grade: user?.grade || 'Not set',
    school: user?.school || 'Not set',
    age: user?.age || 'Not set'
  };

  if (showFullProfile) {
    return (
      <div className="student-profile-full">
        <div className="profile-header">
          <div className="cartoon-avatar-large">
            <div className="avatar-circle-large">
              <span className="avatar-emoji-large">{cartoonAvatar}</span>
            </div>
            <div className="avatar-decoration">
              <span className="decoration-star">⭐</span>
            </div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.fullName || 'Student'}</h2>
            <p className="profile-grade">Grade {userStats.grade}</p>
            {userStats.school !== 'Not set' && (
              <p className="profile-school">🏫 {userStats.school}</p>
            )}
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.totalPoints}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>
          {userStats.age !== 'Not set' && (
            <div className="stat-item">
              <div className="stat-icon">🎂</div>
              <div className="stat-content">
                <div className="stat-value">{userStats.age}</div>
                <div className="stat-label">Years Old</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact profile for header
  return (
    <div className="student-profile-compact">
      <div className="cartoon-avatar">
        <div className="avatar-circle">
          <span className="avatar-emoji">{cartoonAvatar}</span>
        </div>
        <div className="avatar-pulse"></div>
      </div>
      <div className="profile-name-compact">
        <span className="name-text">{user?.fullName?.split(' ')[0] || 'Student'}</span>
      </div>
    </div>
  );
};

export default StudentProfile;

