import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/language';
import Icon from '../../components/icons/Icon';
import adminApiService from '../../services/adminApiService';
import './AdminPages.css';

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getUsers();
      const usersData = response.users
        || response.data?.users
        || (Array.isArray(response.data) ? response.data : [])
        || [];

      const normalizedUsers = usersData.map(user => {
        const isActive = user.isActive !== false;
        return {
          ...user,
          status: user.status || (isActive ? 'active' : 'inactive'),
          progress: typeof user.progress === 'number' ? user.progress : 0,
          lastActive: user.lastActive || user.updatedAt || user.createdAt || null,
          isActive
        };
      });

      setUsers(normalizedUsers);
      setPagination(response.pagination || response.data?.pagination || null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const userStatus = user.isActive !== false ? 'active' : 'inactive';
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'learner': return 'student';
      case 'teacher': return 'teacher';
      case 'parent': return 'users';
      case 'admin': return 'settings';
      default: return 'users';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#4CAF50' : '#F44336';
  };

  const handleAddTeacher = () => {
    setShowAddTeacher(true);
    setError('');
    setSuccess('');
  };

  const handleTeacherInputChange = (e) => {
    setNewTeacher({
      ...newTeacher,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (newTeacher.password !== newTeacher.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      // Call the admin API endpoint to create teacher
      const response = await fetch('/api/auth/admin/create-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          fullName: newTeacher.name,
          email: newTeacher.email,
          password: newTeacher.password
        })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to create teacher account');
        return;
      }

      // Add to local state
      const teacherData = {
        id: result.user.id,
        name: result.user.fullName,
        email: result.user.email,
        role: 'teacher',
        status: 'active',
        progress: 0,
        lastActive: new Date().toISOString(),
        createdBy: 'admin'
      };

      setUsers([...users, teacherData]);
      
      setSuccess('Teacher account created successfully!');
      setNewTeacher({ name: '', email: '', password: '', confirmPassword: '' });
      setShowAddTeacher(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create teacher account');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddTeacher = () => {
    setShowAddTeacher(false);
    setNewTeacher({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Users...</h2>
          <p>Fetching user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Users</h2>
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>User Management</h1>
            <p>Manage users, roles, and permissions</p>
          </div>
          <button 
            className="btn-primary"
            onClick={handleAddTeacher}
          >
            <Icon name="plus" size={16} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="admin-message success">
          <Icon name="check" size={20} />
          {success}
        </div>
      )}
      
      {error && (
        <div className="admin-message error">
          <Icon name="close" size={20} />
          {error}
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddTeacher && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h2>Add New Teacher</h2>
              <button 
                className="modal-close"
                onClick={handleCancelAddTeacher}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTeacher} className="modal-form">
              <div className="form-group">
                <label htmlFor="teacherName">Full Name</label>
                <input
                  type="text"
                  id="teacherName"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleTeacherInputChange}
                  required
                  placeholder="Enter teacher's full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teacherEmail">Email Address</label>
                <input
                  type="email"
                  id="teacherEmail"
                  name="email"
                  value={newTeacher.email}
                  onChange={handleTeacherInputChange}
                  required
                  placeholder="Enter teacher's email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teacherPassword">Password</label>
                <input
                  type="password"
                  id="teacherPassword"
                  name="password"
                  value={newTeacher.password}
                  onChange={handleTeacherInputChange}
                  required
                  minLength="6"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teacherConfirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="teacherConfirmPassword"
                  name="confirmPassword"
                  value={newTeacher.confirmPassword}
                  onChange={handleTeacherInputChange}
                  required
                  placeholder="Confirm password"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleCancelAddTeacher}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="admin-filters">
        <div className="search-box">
          <Icon name="search" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="learner">Learners</option>
            <option value="teacher">Teachers</option>
            <option value="parent">Parents</option>
            <option value="admin">Admins</option>
          </select>
          
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Statistics */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="users" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="check" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{users.filter(u => u.isActive !== false).length}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="student" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{users.filter(u => u.role === 'learner').length}</div>
            <div className="stat-label">Learners</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="teacher" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{users.filter(u => u.role === 'teacher').length}</div>
            <div className="stat-label">Teachers</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      <Icon name={getRoleIcon(user.role)} size={32} />
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.fullName || 'Unknown User'}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="role-badge role-{user.role}">
                    <Icon name={getRoleIcon(user.role)} size={16} />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(user.isActive !== false ? 'active' : 'inactive') }}
                  >
                    <Icon name={user.isActive !== false ? 'check' : 'close'} size={12} />
                    {(user.isActive !== false ? 'active' : 'inactive').charAt(0).toUpperCase() + (user.isActive !== false ? 'active' : 'inactive').slice(1)}
                  </span>
                </td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${user.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{user.progress}%</span>
                  </div>
                </td>
                <td>{user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit User">
                      <Icon name="edit" size={16} />
                    </button>
                    <button className="btn-icon" title="View Details">
                      <Icon name="eye" size={16} />
                    </button>
                    <button className="btn-icon" title="Send Message">
                      <Icon name="message" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="admin-pagination">
        <button className="btn-secondary">
          <Icon name="arrow-left" size={16} />
          Previous
        </button>
        <span className="pagination-info">
          Showing {filteredUsers.length > 0 ? 1 : 0}-{filteredUsers.length} of {pagination?.total ?? users.length} users
        </span>
        <button className="btn-secondary">
          Next
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
