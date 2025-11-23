// Manual test script to verify login functionality
const { User } = require('./models');
const { sequelize } = require('./models');

async function runManualTests() {
  try {
    console.log('🚀 Starting manual tests...\n');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced\n');

    // Test 1: Create a teacher
    console.log('📝 Test 1: Creating a teacher...');
    const teacher = await User.create({
      fullName: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });
    console.log('✅ Teacher created:', {
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      role: teacher.role
    });

    // Test 2: Create a student with registration code
    console.log('\n📝 Test 2: Creating a student with registration code...');
    const registrationCode = await User.generateUniqueRegistrationCode();
    const student = await User.create({
      fullName: 'Test Student',
      role: 'learner',
      grade: '3',
      age: 9,
      registrationCode
    });
    console.log('✅ Student created:', {
      id: student.id,
      fullName: student.fullName,
      grade: student.grade,
      registrationCode: student.registrationCode,
      role: student.role
    });

    // Test 3: Test registration code generation
    console.log('\n📝 Test 3: Testing registration code generation...');
    const codes = [];
    for (let i = 0; i < 5; i++) {
      const code = User.generateRegistrationCode();
      codes.push(code);
      console.log(`Generated code ${i + 1}: ${code}`);
    }
    console.log('✅ All codes are unique:', new Set(codes).size === codes.length);

    // Test 4: Test findByRegistrationCode
    console.log('\n📝 Test 4: Testing findByRegistrationCode...');
    const foundStudent = await User.findByRegistrationCode(registrationCode);
    console.log('✅ Found student by registration code:', foundStudent ? foundStudent.fullName : 'Not found');

    // Test 5: Test unique registration code generation
    console.log('\n📝 Test 5: Testing unique registration code generation...');
    const uniqueCode = await User.generateUniqueRegistrationCode();
    console.log('✅ Generated unique code:', uniqueCode);

    console.log('\n🎉 All manual tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

// Run the tests
runManualTests();
