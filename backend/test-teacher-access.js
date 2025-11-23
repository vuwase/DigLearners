// Test script to verify teacher can access admin endpoints
const jwt = require('jsonwebtoken');
const { User } = require('./models');

const JWT_SECRET = process.env.JWT_SECRET || 'diglearners-secret-key-2024';

async function testTeacherAccess() {
  try {
    console.log('=== Testing Teacher Access to Admin Endpoints ===\n');

    // Find a teacher user
    const teacher = await User.findOne({ where: { role: 'teacher' } });
    
    if (!teacher) {
      console.log('❌ No teacher found in database');
      console.log('Available users:');
      const allUsers = await User.findAll({ attributes: ['id', 'email', 'fullName', 'role'] });
      allUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.fullName}) - Role: ${user.role}`);
      });
      return;
    }

    console.log(`✅ Found teacher: ${teacher.email} (${teacher.fullName})`);
    console.log(`   Role: ${teacher.role}\n`);

    // Generate a JWT token for the teacher
    const token = jwt.sign(
      { userId: teacher.id, email: teacher.email, role: teacher.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('📝 Generated JWT token for teacher');
    console.log(`   Token (first 50 chars): ${token.substring(0, 50)}...\n`);

    // Test the token verification
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`✅ Token verified. Decoded:`, decoded);
    console.log(`   User ID: ${decoded.userId}`);
    console.log(`   Email: ${decoded.email}`);
    console.log(`   Role: ${decoded.role}\n`);

    // Test role authorization logic
    console.log('🔐 Testing role authorization...');
    const allowedRoles = ['teacher', 'admin'];
    const userRole = teacher.role;
    
    console.log(`   User role: ${userRole}`);
    console.log(`   Allowed roles: ${allowedRoles.join(', ')}`);
    
    if (allowedRoles.includes(userRole)) {
      console.log(`   ✅ Access GRANTED - ${userRole} is in allowed roles\n`);
    } else {
      console.log(`   ❌ Access DENIED - ${userRole} is NOT in allowed roles\n`);
    }

    // Test actual API endpoint access using fetch
    console.log('🌐 Testing API endpoint access...');
    const testUrl = 'http://localhost:5000/api/admin/settings';
    
    console.log(`   Testing: GET ${testUrl}`);
    console.log(`   Using token for: ${teacher.email}`);
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      console.log(`   Response status: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS! Teacher can access admin/settings endpoint`);
        console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 200));
      } else {
        console.log(`   ❌ FAILED! Status ${response.status}`);
        console.log(`   Error:`, data.error || data.message);
      }
    } catch (error) {
      console.log(`   ⚠️  Network error: ${error.message}`);
      console.log(`   Make sure the backend server is running on port 5000`);
    }

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Initialize database and run test
const { initializeDatabase } = require('./models');

async function run() {
  try {
    await initializeDatabase();
    await testTeacherAccess();
    process.exit(0);
  } catch (error) {
    console.error('Failed to run test:', error);
    process.exit(1);
  }
}

run();

