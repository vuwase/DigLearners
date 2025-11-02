// Script to list all students in the database
const { sequelize, User } = require('../models');

async function listStudents() {
  try {
    console.log('👨‍🎓 Students in Database\n');
    console.log('='.repeat(80));

    // Get all learners (students)
    const students = await User.findAll({
      where: { role: 'learner' },
      order: [['grade', 'ASC'], ['fullName', 'ASC']]
    });

    console.log(`\n📊 Total Students: ${students.length}\n`);

    if (students.length === 0) {
      console.log('  No students found in database.');
      console.log('\n💡 Tip: Students are created by teachers using the registration system.');
    } else {
      // Group by grade
      const byGrade = {};
      students.forEach(student => {
        const grade = student.grade || 'No Grade';
        if (!byGrade[grade]) {
          byGrade[grade] = [];
        }
        byGrade[grade].push(student);
      });

      // Display students grouped by grade
      Object.keys(byGrade).sort().forEach(grade => {
        console.log(`\n📚 Grade ${grade} (${byGrade[grade].length} students):`);
        console.log('-'.repeat(80));
        byGrade[grade].forEach((student, index) => {
          console.log(`\n  ${index + 1}. ${student.fullName || 'No Name'}`);
          console.log(`     ID: ${student.id}`);
          console.log(`     Email: ${student.email || 'N/A (Student login uses registration code)'}`);
          console.log(`     Grade: ${student.grade || 'N/A'}`);
          console.log(`     Age: ${student.age || 'N/A'}`);
          console.log(`     Registration Code: ${student.registrationCode || 'N/A'}`);
          console.log(`     Role: ${student.role}`);
          console.log(`     Created: ${student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}`);
        });
      });

      // Summary statistics
      console.log(`\n\n${'='.repeat(80)}`);
      console.log('📊 SUMMARY STATISTICS:\n');
      
      console.log(`   Total Students: ${students.length}`);
      console.log(`\n   By Grade:`);
      Object.keys(byGrade).sort().forEach(grade => {
        console.log(`     Grade ${grade}: ${byGrade[grade].length} students`);
      });

      // Count students with/without registration codes
      const withCode = students.filter(s => s.registrationCode).length;
      const withoutCode = students.length - withCode;
      console.log(`\n   Registration Codes:`);
      console.log(`     With Registration Code: ${withCode}`);
      console.log(`     Without Registration Code: ${withoutCode}`);

      // Count students with/without email
      const withEmail = students.filter(s => s.email).length;
      const withoutEmail = students.length - withEmail;
      console.log(`\n   Email Addresses:`);
      console.log(`     With Email: ${withEmail}`);
      console.log(`     Without Email: ${withoutEmail}`);

      // Count students with/without age
      const withAge = students.filter(s => s.age).length;
      const withoutAge = students.length - withAge;
      console.log(`\n   Age Information:`);
      console.log(`     With Age: ${withAge}`);
      console.log(`     Without Age: ${withoutAge}`);

      // Recent students (last 5)
      console.log(`\n   Recent Students (Last 5 Created):`);
      const recentStudents = [...students]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      recentStudents.forEach((student, index) => {
        console.log(`     ${index + 1}. ${student.fullName} (Grade ${student.grade || 'N/A'}) - Created: ${new Date(student.createdAt).toLocaleDateString()}`);
      });
    }

    // Also show other users (teachers, admins) for context
    const teachers = await User.findAll({
      where: { role: 'teacher' },
      order: [['fullName', 'ASC']]
    });

    const admins = await User.findAll({
      where: { role: 'admin' },
      order: [['fullName', 'ASC']]
    });

    console.log(`\n\n${'='.repeat(80)}`);
    console.log('👥 ALL USERS IN DATABASE:\n');
    console.log(`   Students (Learners): ${students.length}`);
    console.log(`   Teachers: ${teachers.length}`);
    console.log(`   Admins: ${admins.length}`);
    console.log(`   Total Users: ${students.length + teachers.length + admins.length}`);

    if (teachers.length > 0) {
      console.log(`\n   Teachers:`);
      teachers.forEach((teacher, index) => {
        console.log(`     ${index + 1}. ${teacher.fullName} (${teacher.email})`);
      });
    }

    if (admins.length > 0) {
      console.log(`\n   Admins:`);
      admins.forEach((admin, index) => {
        console.log(`     ${index + 1}. ${admin.fullName} (${admin.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Error listing students:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
listStudents();

