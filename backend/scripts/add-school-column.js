// Migration script to add 'school' column to users table
// Run this once to update existing database schema
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../data/diglearners.db'),
  logging: console.log
});

async function addSchoolColumn() {
  try {
    console.log('Adding school column to users table...');
    
    // Check if column already exists
    const [results] = await sequelize.query(`
      PRAGMA table_info(users);
    `);
    
    const hasSchoolColumn = results.some(col => col.name === 'school');
    
    if (hasSchoolColumn) {
      console.log('School column already exists. Skipping migration.');
      return;
    }
    
    // Add the school column
    await sequelize.query(`
      ALTER TABLE users ADD COLUMN school VARCHAR(255);
    `);
    
    console.log('✅ School column added successfully!');
    console.log('You can now register students with their school information.');
    
  } catch (error) {
    console.error('❌ Error adding school column:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addSchoolColumn()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });

