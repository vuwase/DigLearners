// Script to list all student content in the database
const { sequelize, Lesson, GamifiedContent, Badge } = require('../models');

async function listStudentContent() {
  try {
    console.log('📚 Student Content in Database\n');
    console.log('='.repeat(70));

    // Get all lessons
    const lessons = await Lesson.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });

    console.log(`\n📖 LESSONS (${lessons.length} total):\n`);
    if (lessons.length === 0) {
      console.log('  No lessons found in database.');
    } else {
      lessons.forEach((lesson, index) => {
        console.log(`  ${index + 1}. ${lesson.title}`);
        console.log(`     Module Type: ${lesson.moduleType}`);
        console.log(`     Difficulty: ${lesson.difficulty || 'N/A'}`);
        console.log(`     Age Group: ${lesson.ageGroup || 'N/A'}`);
        console.log(`     Description: ${lesson.description || 'N/A'}`);
        console.log(`     Order: ${lesson.order || 'N/A'}`);
        console.log('');
      });
    }

    // Get all gamified content
    const gamifiedContent = await GamifiedContent.findAll({
      where: { isActive: true },
      order: [['grade', 'ASC'], ['ageGroup', 'ASC'], ['title', 'ASC']]
    });

    console.log(`\n🎮 GAMIFIED CONTENT/GAMES (${gamifiedContent.length} total):\n`);
    if (gamifiedContent.length === 0) {
      console.log('  No gamified content found in database.');
    } else {
      // Group by grade
      const byGrade = {};
      gamifiedContent.forEach(item => {
        const grade = item.grade || 'Unknown';
        if (!byGrade[grade]) {
          byGrade[grade] = [];
        }
        byGrade[grade].push(item);
      });

      Object.keys(byGrade).sort().forEach(grade => {
        console.log(`\n  📚 Grade ${grade} (${byGrade[grade].length} items):`);
        byGrade[grade].forEach((item, index) => {
          console.log(`\n     ${index + 1}. ${item.title}`);
          console.log(`        Subject: ${item.subject || 'N/A'}`);
          console.log(`        Type: ${item.gameType}`);
          console.log(`        Difficulty: ${item.difficulty}`);
          console.log(`        Age Group: ${item.ageGroup || 'N/A'}`);
          console.log(`        Points Reward: ${item.pointsReward || 0}`);
          console.log(`        Estimated Time: ${item.estimatedTime || 'N/A'} min`);
          console.log(`        Description: ${item.description || 'N/A'}`);
        });
      });
    }

    // Get all badges
    const badges = await Badge.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    console.log(`\n\n🏆 BADGES (${badges.length} total):\n`);
    if (badges.length === 0) {
      console.log('  No badges found in database.');
    } else {
      // Group by category
      const byCategory = {};
      badges.forEach(badge => {
        const category = badge.category || 'Other';
        if (!byCategory[category]) {
          byCategory[category] = [];
        }
        byCategory[category].push(badge);
      });

      Object.keys(byCategory).sort().forEach(category => {
        console.log(`\n  📂 ${category.toUpperCase()} (${byCategory[category].length} badges):`);
        byCategory[category].forEach((badge, index) => {
          console.log(`\n     ${index + 1}. ${badge.icon || '🏅'} ${badge.name}`);
          console.log(`        Description: ${badge.description || 'N/A'}`);
          console.log(`        Points: ${badge.points || 0}`);
          console.log(`        Criteria: ${badge.criteria || 'N/A'}`);
        });
      });
    }

    // Summary
    console.log(`\n\n${'='.repeat(70)}`);
    console.log('📊 SUMMARY:');
    console.log(`   Total Lessons: ${lessons.length}`);
    console.log(`   Total Games/Content: ${gamifiedContent.length}`);
    console.log(`   Total Badges: ${badges.length}`);
    console.log(`\n   Content by Grade:`);
    
    const gradeStats = {};
    gamifiedContent.forEach(item => {
      const grade = item.grade || 'Unknown';
      gradeStats[grade] = (gradeStats[grade] || 0) + 1;
    });
    
    Object.keys(gradeStats).sort().forEach(grade => {
      console.log(`     Grade ${grade}: ${gradeStats[grade]} items`);
    });

  } catch (error) {
    console.error('❌ Error listing student content:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
listStudentContent();

