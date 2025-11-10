// Learner API Service - Complete backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class LearnerApiService {
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
    
    console.log(`[API] Making request to: ${url}`);
    console.log(`[API] Token present: ${!!token}`);
    
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
      console.log(`[API] Response status: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      console.log(`[API] Response data:`, data);

      if (!response.ok) {
        console.error(`[API] Error response:`, data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`[API] Request failed for ${url}:`, error);
      console.error(`[API] Error details:`, error.message, error.stack);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardData() {
    return this.makeRequest('/learner/dashboard');
  }

  // Lessons API
  async getLessons(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/learning/lessons?${queryString}` : '/learning/lessons';
    
    return this.makeRequest(endpoint);
  }

  async getLessonContent(lessonId) {
    return this.makeRequest(`/learning/lessons/${lessonId}`);
  }

  async startLesson(lessonId) {
    return this.makeRequest(`/learning/lessons/${lessonId}/start`, {
      method: 'POST'
    });
  }

  async completeLesson(lessonId, completionData) {
    return this.makeRequest(`/learning/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData)
    });
  }

  // Progress API
  async getProgress() {
    return this.makeRequest('/learning/progress');
  }

  async getProgressByLesson(lessonId) {
    return this.makeRequest(`/learning/progress/${lessonId}`);
  }

  async submitLessonProgress(progressData) {
    return this.makeRequest('/learner/progress', {
      method: 'POST',
      body: JSON.stringify(progressData)
    });
  }

  // Achievements API
  async getAchievements() {
    // Use /learner/achievements endpoint (it exists and works)
    return this.makeRequest('/learner/achievements');
  }

  async getBadges() {
    return this.makeRequest('/learning/badges');
  }

  async unlockBadge(badgeId) {
    return this.makeRequest(`/learning/badges/${badgeId}/unlock`, {
      method: 'POST'
    });
  }

  // Gamified Content API
  async getMyGames() {
    return this.makeRequest('/gamified/my-content');
  }

  async getGamesByAgeGroup(ageGroup) {
    return this.makeRequest(`/gamified/age-group/${ageGroup}`);
  }

  async getGamesByGrade(grade) {
    return this.makeRequest(`/gamified/grade/${grade}`);
  }

  async getGameById(gameId) {
    return this.makeRequest(`/gamified/game/${gameId}`);
  }

  async startGame(gameId) {
    return this.makeRequest(`/gamified/game/${gameId}/start`, {
      method: 'POST'
    });
  }

  async completeGame(gameId, completionData) {
    return this.makeRequest(`/gamified/game/${gameId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData)
    });
  }

  // Assignments API
  async getAssignments() {
    return this.makeRequest('/learning/assignments');
  }

  async getAssignment(assignmentId) {
    return this.makeRequest(`/learning/assignments/${assignmentId}`);
  }

  async submitAssignment(assignmentId, submissionData) {
    return this.makeRequest(`/learning/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });
  }

  // Profile API
  async getProfile() {
    return this.makeRequest('/learner/profile');
  }

  async updateProfile(profileData) {
    return this.makeRequest('/learner/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Test endpoint
  async testConnection() {
    return this.makeRequest('/learning/test');
  }
}

// Create and export singleton instance
const learnerApiService = new LearnerApiService();
export default learnerApiService;
