// Create a teacher account for testing
const { User } = require('./models');
const { sequelize } = require('./models');

async function createTeacher() {
  try {
    console.log('🚀 Creating teacher account...\n');

    // Sync database
    await sequelize.sync();
    console.log('✅ Database synced\n');

    // Create teacher
    const teacher = await User.create({
      fullName: 'Test Teacher',
      email: 'testteacher@diglearners.com',
      password: 'password123',
      role: 'teacher'
    });

    console.log('✅ Teacher created:', {
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      role: teacher.role
    });

    console.log('\n🎉 Teacher account created successfully!');
    console.log('You can now login with:');
    console.log('Email: testteacher@diglearners.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Failed to create teacher:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
  }
}

createTeacher();
