// Admin API Service - Complete backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Make authenticated API request
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardData() {
    return this.makeRequest('/admin/dashboard');
  }

  // User Management API
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    
    return this.makeRequest(endpoint);
  }

  async createUser(userData) {
    return this.makeRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(userId, updateData) {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteUser(userId) {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }

  async toggleUserStatus(userId) {
    return this.makeRequest(`/admin/users/${userId}/toggle-status`, {
      method: 'POST'
    });
  }

  // Content Management API
  async getContent(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/content?${queryString}` : '/admin/content';
    
    return this.makeRequest(endpoint);
  }

  async createContent(contentData) {
    return this.makeRequest('/admin/content', {
      method: 'POST',
      body: JSON.stringify(contentData)
    });
  }

  async updateContent(contentId, updateData) {
    return this.makeRequest(`/admin/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteContent(contentId) {
    return this.makeRequest(`/admin/content/${contentId}`, {
      method: 'DELETE'
    });
  }

  async publishContent(contentId) {
    return this.makeRequest(`/admin/content/${contentId}/publish`, {
      method: 'POST'
    });
  }

  // Analytics API
  async getAnalytics(period = 'week') {
    return this.makeRequest(`/admin/analytics?period=${period}`);
  }

  async getSystemStats() {
    return this.makeRequest('/admin/stats');
  }

  // Reports API
  async getReports(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/reports?${queryString}` : '/admin/reports';
    
    return this.makeRequest(endpoint);
  }

  async generateReport(reportData) {
    return this.makeRequest('/admin/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  }

  // Settings API
  async getSettings() {
    return this.makeRequest('/admin/settings');
  }

  async updateSettings(settingsData) {
    return this.makeRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  }

  // Test endpoint
  async testConnection() {
    return this.makeRequest('/admin/test');
  }
}

// Create and export singleton instance
const adminApiService = new AdminApiService();
export default adminApiService;
