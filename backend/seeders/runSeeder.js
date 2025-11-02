// Database Seeder Runner
const { initializeDatabase } = require('../models');
const { seedDatabase } = require('./sampleData');

async function runSeeder() {
  try {
    console.log('🚀 Starting DigLearners Database Seeder...');
    console.log('═══════════════════════════════════════════════════════');
    
    // Initialize database with force sync
    console.log('📊 Initializing database...');
    const { sequelize } = require('../models');
    await sequelize.sync({ force: true }); // Force recreate tables
    console.log('✅ Database initialized successfully');
    
    // Seed with sample data
    console.log('🌱 Seeding database with sample data...');
    await seedDatabase();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = { runSeeder };
