const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Attempt to load dotenv if it's available (for local scripts)
try {
  require('dotenv').config();
} catch (err) {
  const hasEnv = fs.existsSync(path.join(__dirname, '.env'));
  if (hasEnv) {
    console.warn('⚠️  Could not load dotenv package. Run this script with "node -r dotenv/config create-teacher.js ..." or install dotenv locally.');
  }
}

const { sequelize, User } = require('./models');

const parseArgs = () => {
  const [, , ...rawArgs] = process.argv;
  return rawArgs.reduce((acc, arg) => {
    const normalized = arg.replace(/^--/, '');
    const [key, ...rest] = normalized.split('=');
    if (!key) return acc;
    acc[key] = rest.join('=') || true;
    return acc;
  }, {});
};

const args = parseArgs();

const teacherPayload = {
  fullName: args.fullName || args.name || process.env.TEACHER_NAME,
  email: args.email || process.env.TEACHER_EMAIL,
  password: args.password || process.env.TEACHER_PASSWORD || crypto.randomBytes(10).toString('hex'),
  role: (args.role || process.env.TEACHER_ROLE || 'teacher').toLowerCase()
};

if (!teacherPayload.fullName || !teacherPayload.email) {
  console.error('❌ Missing required arguments. Provide --fullName and --email (and optionally --password, --role).');
  console.error('   Example: node create-teacher.js --fullName="Jane Doe" --email=jane@example.com --password=Secure123!');
  process.exit(1);
}

if (!['teacher', 'admin'].includes(teacherPayload.role)) {
  console.error('❌ Invalid role. Allowed roles: teacher, admin.');
  process.exit(1);
}

async function createTeacher() {
  try {
    console.log('🚀 Creating teacher account...\n');

    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Database connection ready\n');

    const existing = await User.findOne({ where: { email: teacherPayload.email } });
    if (existing) {
      console.log('ℹ️  A user with this email already exists. Updating their details instead.\n');
      await existing.update({
        fullName: teacherPayload.fullName,
        role: teacherPayload.role
      });

      if (args.password || process.env.TEACHER_PASSWORD) {
        await existing.update({ password: teacherPayload.password });
        console.log('🔐 Password updated.');
      }

      console.log('✅ User updated:', {
        id: existing.id,
        fullName: existing.fullName,
        email: existing.email,
        role: existing.role
      });
    } else {
      const teacher = await User.create(teacherPayload);
      console.log('✅ Teacher created:', {
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        role: teacher.role
      });
    }

    console.log('\n🎉 Teacher credentials');
    console.log(`   Name: ${teacherPayload.fullName}`);
    console.log(`   Email: ${teacherPayload.email}`);
    console.log(`   Role: ${teacherPayload.role}`);
    console.log(`   Password: ${teacherPayload.password}`);
    console.log('\n👉 Use these credentials to log in via the Teacher portal.');
  } catch (error) {
    console.error('❌ Failed to create teacher:', error.message);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

createTeacher();
