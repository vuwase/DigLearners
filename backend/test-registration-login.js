// Manual test script for registration and login
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testRegistrationAndLogin() {
  console.log('🧪 Testing Registration and Login\n');
  console.log('=' .repeat(60));
  
  const testEmail = `testteacher${Date.now()}@diglearners.com`;
  const testPassword = 'password123';
  const testName = 'Test Teacher';

  try {
    // Test 1: Teacher Registration
    console.log('\n📝 Test 1: Teacher Registration');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('Name:', testName);
    
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      fullName: testName,
      email: testEmail,
      password: testPassword,
      role: 'teacher'
    });

    console.log('✅ Registration Response:', {
      success: registerResponse.data.success,
      userId: registerResponse.data.user?.id || registerResponse.data.userId,
      email: registerResponse.data.user?.email,
      role: registerResponse.data.user?.role,
      message: registerResponse.data.message
    });

    if (!registerResponse.data.success) {
      console.error('❌ Registration failed:', registerResponse.data.error);
      return;
    }

    // Test 2: Verify User Exists (try to login)
    console.log('\n🔐 Test 2: Teacher Login');
    console.log('Attempting login with registered credentials...');
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      loginType: 'teacher',
      email: testEmail,
      password: testPassword
    });

    console.log('✅ Login Response:', {
      success: loginResponse.data.success,
      hasToken: !!loginResponse.data.token,
      userEmail: loginResponse.data.user?.email,
      userRole: loginResponse.data.user?.role,
      userId: loginResponse.data.user?.id,
      message: loginResponse.data.message
    });

    if (loginResponse.data.success && loginResponse.data.token) {
      console.log('\n🎉 SUCCESS! Registration and login both working correctly!');
      console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
    } else {
      console.error('❌ Login failed:', loginResponse.data.error);
    }

    // Test 3: Try login with wrong password
    console.log('\n🔒 Test 3: Login with Wrong Password');
    try {
      const wrongPasswordResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        loginType: 'teacher',
        email: testEmail,
        password: 'wrongpassword'
      });
      console.error('❌ ERROR: Login should have failed with wrong password!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected wrong password');
        console.log('Error:', error.response.data.error);
      } else {
        console.error('❌ Unexpected error:', error.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Is the backend running on', API_BASE_URL, '?');
      console.error('Please start the backend with: npm start');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test completed!');
}

// Check if server is running first
axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    testRegistrationAndLogin();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start the backend server first:');
    console.error('  cd backend');
    console.error('  npm start');
    process.exit(1);
  });

