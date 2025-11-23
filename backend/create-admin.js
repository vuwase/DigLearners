// Create an admin account for testing
const { User } = require('./models');
const { sequelize } = require('./models');

async function createAdmin() {
  try {
    console.log('🚀 Creating admin account...\n');

    // Sync database
    await sequelize.sync();
    console.log('✅ Database synced\n');

    // Create admin
    const admin = await User.create({
      fullName: 'System Administrator',
      email: 'admin@diglearners.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin created:', {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role
    });

    console.log('\n🎉 Admin account created successfully!');
    console.log('You can now login with:');
    console.log('Email: admin@diglearners.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    if (error.message.includes('unique')) {
      console.log('ℹ️  Admin account already exists, you can login with:');
      console.log('Email: admin@diglearners.com');
      console.log('Password: admin123');
    }
  } finally {
    await sequelize.close();
  }
}

createAdmin();
