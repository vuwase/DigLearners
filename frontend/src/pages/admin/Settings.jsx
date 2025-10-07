import React, { useState } from 'react';
import { useTranslation } from '../../lib/language';
import Icon from '../../components/icons/Icon';
import adminMockDataService from '../../services/adminMockDataService';
import './AdminPages.css';

const Settings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(adminMockDataService.getSettings());
  const [activeTab, setActiveTab] = useState('system');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    setSettings(adminMockDataService.getSettings());
    setHasChanges(false);
  };

  const settingTabs = [
    { id: 'system', label: 'System', icon: 'settings' },
    { id: 'user', label: 'User Management', icon: 'users' },
    { id: 'content', label: 'Content', icon: 'book' },
    { id: 'notifications', label: 'Notifications', icon: 'message' }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Configure platform settings and preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="settings-tabs">
        {settingTabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="settings-section">
          <div className="settings-group">
            <h3>General Settings</h3>
            <div className="setting-item">
              <label>Site Name</label>
              <input
                type="text"
                value={settings.systemSettings.siteName}
                onChange={(e) => handleSettingChange('systemSettings', 'siteName', e.target.value)}
              />
            </div>
            
            <div className="setting-item">
              <label>Site Description</label>
              <textarea
                value={settings.systemSettings.siteDescription}
                onChange={(e) => handleSettingChange('systemSettings', 'siteDescription', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.systemSettings.maintenanceMode}
                  onChange={(e) => handleSettingChange('systemSettings', 'maintenanceMode', e.target.checked)}
                />
                <span className="checkmark"></span>
                Maintenance Mode
              </label>
              <p className="setting-description">
                Enable maintenance mode to restrict access to the platform
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.systemSettings.registrationEnabled}
                  onChange={(e) => handleSettingChange('systemSettings', 'registrationEnabled', e.target.checked)}
                />
                <span className="checkmark"></span>
                Allow User Registration
              </label>
              <p className="setting-description">
                Allow new users to register on the platform
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.systemSettings.emailNotifications}
                  onChange={(e) => handleSettingChange('systemSettings', 'emailNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Email Notifications
              </label>
              <p className="setting-description">
                Send email notifications for system events
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Settings */}
      {activeTab === 'user' && (
        <div className="settings-section">
          <div className="settings-group">
            <h3>User Management</h3>
            <div className="setting-item">
              <label>Default User Role</label>
              <select
                value={settings.userSettings.defaultRole}
                onChange={(e) => handleSettingChange('userSettings', 'defaultRole', e.target.value)}
              >
                <option value="learner">Learner</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Max Users Per Class</label>
              <input
                type="number"
                value={settings.userSettings.maxUsersPerClass}
                onChange={(e) => handleSettingChange('userSettings', 'maxUsersPerClass', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.userSettings.requireEmailVerification}
                  onChange={(e) => handleSettingChange('userSettings', 'requireEmailVerification', e.target.checked)}
                />
                <span className="checkmark"></span>
                Require Email Verification
              </label>
              <p className="setting-description">
                Users must verify their email before accessing the platform
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.userSettings.allowSelfRegistration}
                  onChange={(e) => handleSettingChange('userSettings', 'allowSelfRegistration', e.target.checked)}
                />
                <span className="checkmark"></span>
                Allow Self Registration
              </label>
              <p className="setting-description">
                Allow users to register themselves without admin approval
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Settings */}
      {activeTab === 'content' && (
        <div className="settings-section">
          <div className="settings-group">
            <h3>Content Management</h3>
            <div className="setting-item">
              <label>Max Lesson Duration (minutes)</label>
              <input
                type="number"
                value={settings.contentSettings.maxLessonDuration}
                onChange={(e) => handleSettingChange('contentSettings', 'maxLessonDuration', parseInt(e.target.value))}
                min="5"
                max="180"
              />
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.contentSettings.autoApproveLessons}
                  onChange={(e) => handleSettingChange('contentSettings', 'autoApproveLessons', e.target.checked)}
                />
                <span className="checkmark"></span>
                Auto-approve Lessons
              </label>
              <p className="setting-description">
                Automatically approve new lessons without manual review
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.contentSettings.allowUserGeneratedContent}
                  onChange={(e) => handleSettingChange('contentSettings', 'allowUserGeneratedContent', e.target.checked)}
                />
                <span className="checkmark"></span>
                Allow User-Generated Content
              </label>
              <p className="setting-description">
                Allow users to create and submit their own content
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.contentSettings.contentModeration}
                  onChange={(e) => handleSettingChange('contentSettings', 'contentModeration', e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable Content Moderation
              </label>
              <p className="setting-description">
                Review all content before it becomes visible to users
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="settings-section">
          <div className="settings-group">
            <h3>Notification Preferences</h3>
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.emailNotifications}
                  onChange={(e) => handleSettingChange('notificationSettings', 'emailNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Email Notifications
              </label>
              <p className="setting-description">
                Send notifications via email
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.pushNotifications}
                  onChange={(e) => handleSettingChange('notificationSettings', 'pushNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Push Notifications
              </label>
              <p className="setting-description">
                Send push notifications to user devices
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.weeklyDigest}
                  onChange={(e) => handleSettingChange('notificationSettings', 'weeklyDigest', e.target.checked)}
                />
                <span className="checkmark"></span>
                Weekly Digest
              </label>
              <p className="setting-description">
                Send weekly summary emails to users
              </p>
            </div>
            
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.achievementNotifications}
                  onChange={(e) => handleSettingChange('notificationSettings', 'achievementNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Achievement Notifications
              </label>
              <p className="setting-description">
                Notify users when they earn achievements
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save Actions */}
      {hasChanges && (
        <div className="settings-actions">
          <button className="btn-secondary" onClick={handleReset}>
            <Icon name="recent" size={16} />
            Reset Changes
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Icon name="check" size={16} />
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
