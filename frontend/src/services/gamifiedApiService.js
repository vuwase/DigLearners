// Gamified Content API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class GamifiedApiService {
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

  // Get content by age group
  async getContentByAgeGroup(ageGroup) {
    return this.makeRequest(`/gamified/age-group/${ageGroup}`);
  }

  // Get content by grade
  async getContentByGrade(grade) {
    return this.makeRequest(`/gamified/grade/${grade}`);
  }

  // Get content by subject
  async getContentBySubject(subject, filters = {}) {
    const params = new URLSearchParams();
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);
    
    const queryString = params.toString();
    const endpoint = `/gamified/subject/${subject}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get all content with optional filters
  async getAllContent(filters = {}) {
    const params = new URLSearchParams();
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.gameType) params.append('gameType', filters.gameType);
    
    const queryString = params.toString();
    const endpoint = `/gamified/all${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get content for authenticated user's grade
  async getMyContent() {
    return this.makeRequest('/gamified/my-content');
  }

  async saveProgress(progressData) {
    return this.makeRequest('/gamified/progress', {
      method: 'POST',
      body: JSON.stringify(progressData)
    });
  }

  // Create new gamified content (admin/teacher only)
  async createContent(contentData) {
    return this.makeRequest('/gamified/create', {
      method: 'POST',
      body: JSON.stringify(contentData)
    });
  }

  // Test endpoint
  async testConnection() {
    return this.makeRequest('/gamified/test');
  }
}

// Create and export singleton instance
const gamifiedApiService = new GamifiedApiService();
export default gamifiedApiService;
