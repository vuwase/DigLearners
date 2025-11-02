// Teacher API Service - Real data integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class TeacherApiService {
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
    return this.makeRequest('/teacher/dashboard');
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
    const endpoint = queryString ? `/teacher/lessons?${queryString}` : '/teacher/lessons';
    
    return this.makeRequest(endpoint);
  }

  async createLesson(lessonData) {
    return this.makeRequest('/teacher/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData)
    });
  }

  async updateLesson(lessonId, updateData) {
    return this.makeRequest(`/teacher/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async publishLesson(lessonId) {
    return this.makeRequest(`/teacher/lessons/${lessonId}/publish`, {
      method: 'POST'
    });
  }

  async deleteLesson(lessonId) {
    return this.makeRequest(`/teacher/lessons/${lessonId}`, {
      method: 'DELETE'
    });
  }

  // Students API
  async getStudents(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/teacher/students?${queryString}` : '/teacher/students';
    
    return this.makeRequest(endpoint);
  }

  // Analytics API
  async getAnalytics(period = 'week') {
    return this.makeRequest(`/teacher/analytics?period=${period}`);
  }

  // Assignments API
  async getAssignments(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/teacher/assignments?${queryString}` : '/teacher/assignments';
    
    return this.makeRequest(endpoint);
  }

  async createAssignment(assignmentData) {
    return this.makeRequest('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData)
    });
  }

  async updateAssignment(assignmentId, updateData) {
    return this.makeRequest(`/teacher/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async publishAssignment(assignmentId) {
    return this.makeRequest(`/teacher/assignments/${assignmentId}/publish`, {
      method: 'POST'
    });
  }

  async deleteAssignment(assignmentId) {
    return this.makeRequest(`/teacher/assignments/${assignmentId}`, {
      method: 'DELETE'
    });
  }

  // Child registration
  async registerChild(childData) {
    return this.makeRequest('/teacher/register-child', {
      method: 'POST',
      body: JSON.stringify(childData)
    });
  }

  // Get all students
  async getStudents() {
    return this.makeRequest('/teacher/students');
  }

  // Register a new student (teacher creates registration code)
  async registerStudent(studentData) {
    return this.makeRequest('/teacher/register-student', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  }

  // Get all students with registration codes
  async getMyStudents() {
    return this.makeRequest('/teacher/my-students');
  }

  // Update student profile
  async updateStudent(studentId, studentData) {
    return this.makeRequest(`/teacher/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  }
}

// Create and export singleton instance
const teacherApiService = new TeacherApiService();
export default teacherApiService;
