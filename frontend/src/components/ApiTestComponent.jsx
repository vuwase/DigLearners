// API Connection Test Component
import React, { useState, useEffect } from 'react';
import { healthCheck, testConnection } from '../services/apiService';
import authService from '../services/authService';
import teacherApiService from '../services/teacherApiService';
import learnerApiService from '../services/learnerApiService';
import adminApiService from '../services/adminApiService';
import gamifiedApiService from '../services/gamifiedApiService';

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runAllTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test basic connectivity
      console.log('Testing basic connectivity...');
      results.health = await healthCheck();
      results.test = await testConnection();
    } catch (error) {
      results.health = { error: error.message };
      results.test = { error: error.message };
    }

    try {
      // Test auth endpoints
      console.log('Testing auth endpoints...');
      results.auth = await authService.verifyToken();
    } catch (error) {
      results.auth = { error: error.message };
    }

    try {
      // Test teacher endpoints
      console.log('Testing teacher endpoints...');
      results.teacher = await teacherApiService.testConnection();
    } catch (error) {
      results.teacher = { error: error.message };
    }

    try {
      // Test learner endpoints
      console.log('Testing learner endpoints...');
      results.learner = await learnerApiService.testConnection();
    } catch (error) {
      results.learner = { error: error.message };
    }

    try {
      // Test admin endpoints
      console.log('Testing admin endpoints...');
      results.admin = await adminApiService.testConnection();
    } catch (error) {
      results.admin = { error: error.message };
    }

    try {
      // Test gamified endpoints
      console.log('Testing gamified endpoints...');
      results.gamified = await gamifiedApiService.testConnection();
    } catch (error) {
      results.gamified = { error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (result) => {
    if (result.error) return '❌';
    if (result.success) return '✅';
    return '⏳';
  };

  const getStatusText = (result) => {
    if (result.error) return `Error: ${result.error}`;
    if (result.success) return 'Connected';
    return 'Testing...';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Connection Test</h1>
      <p>Testing all backend API connections...</p>
      
      <button 
        onClick={runAllTests} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Run Tests Again'}
      </button>

      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Health Check:</strong> {getStatusIcon(testResults.health)} {getStatusText(testResults.health)}
        </div>
        
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Test Endpoint:</strong> {getStatusIcon(testResults.test)} {getStatusText(testResults.test)}
        </div>
        
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Auth Service:</strong> {getStatusIcon(testResults.auth)} {getStatusText(testResults.auth)}
        </div>
        
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Teacher API:</strong> {getStatusIcon(testResults.teacher)} {getStatusText(testResults.teacher)}
        </div>
        
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Learner API:</strong> {getStatusIcon(testResults.learner)} {getStatusText(testResults.learner)}
        </div>
        
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Admin API:</strong> {getStatusIcon(testResults.admin)} {getStatusText(testResults.admin)}
        </div>
        
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <strong>Gamified API:</strong> {getStatusIcon(testResults.gamified)} {getStatusText(testResults.gamified)}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Test Results Summary:</h3>
        <pre>{JSON.stringify(testResults, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ApiTestComponent;
