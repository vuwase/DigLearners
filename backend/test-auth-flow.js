// Test script for registration and login flow
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `testteacher_${Date.now()}@diglearners.com`;
const TEST_PASSWORD = 'testpassword123';
const TEST_NAME = 'Test Teacher';

async function testRegistrationAndLogin() {
  console.log('🧪 Starting Registration and Login Flow Test\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Register a new teacher
    console.log('\n📝 Test 1: Registering new teacher...');
    console.log(`Email: ${TEST_EMAIL}`);
    console.log(`Name: ${TEST_NAME}`);
    
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      fullName: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: 'teacher'
    });

    console.log('✅ Registration Response:', {
      success: registerResponse.data.success,
      userId: registerResponse.data.user?.id,
      email: registerResponse.data.user?.email,
      role: registerResponse.data.user?.role,
      message: registerResponse.data.message
    });

    if (!registerResponse.data.success) {
      console.error('❌ Registration failed:', registerResponse.data.error);
      return;
    }

    // Wait a moment for database to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Login with the registered credentials
    console.log('\n🔐 Test 2: Logging in with registered credentials...');
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      loginType: 'teacher'
    });

    console.log('✅ Login Response:', {
      success: loginResponse.data.success,
      userId: loginResponse.data.user?.id,
      email: loginResponse.data.user?.email,
      role: loginResponse.data.user?.role,
      hasToken: !!loginResponse.data.token,
      message: loginResponse.data.message
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.error);
      return;
    }

    // Test 3: Verify token by accessing protected endpoint
    console.log('\n🔒 Test 3: Verifying token with protected endpoint...');
    
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });

    console.log('✅ Profile Response:', {
      success: profileResponse.data.success,
      userId: profileResponse.data.user?.id,
      email: profileResponse.data.user?.email,
      role: profileResponse.data.user?.role
    });

    console.log('\n' + '='.repeat(60));
    console.log('🎉 All tests passed successfully!');
    console.log(`\n✅ User registered with ID: ${registerResponse.data.user?.id}`);
    console.log(`✅ User can login successfully`);
    console.log(`✅ Token works for protected routes`);
    console.log(`\nYou can now login with:\n  Email: ${TEST_EMAIL}\n  Password: ${TEST_PASSWORD}`);

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the backend running on http://localhost:5000?');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the test
console.log('Waiting for backend to be ready...');
setTimeout(() => {
  testRegistrationAndLogin();
}, 3000);

