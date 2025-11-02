const { User } = require('../models');
const { sequelize } = require('../models');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await User.destroy({ where: {} });
  });

  describe('Registration Code Generation', () => {
    test('should generate a 6-character registration code', () => {
      const code = User.generateRegistrationCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
      expect(code.length).toBe(6);
    });

    test('should generate different codes on multiple calls', () => {
      const code1 = User.generateRegistrationCode();
      const code2 = User.generateRegistrationCode();
      const code3 = User.generateRegistrationCode();
      
      expect(code1).not.toBe(code2);
      expect(code2).not.toBe(code3);
      expect(code1).not.toBe(code3);
    });

    test('should generate unique registration code', async () => {
      const code = await User.generateUniqueRegistrationCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
      
      // Verify it's unique by checking database
      const existingUser = await User.findByRegistrationCode(code);
      expect(existingUser).toBeNull();
    });

    test('should handle collision and generate new code', async () => {
      // Create a user with a specific code
      const existingCode = 'ABC123';
      await User.create({
        fullName: 'Existing User',
        role: 'learner',
        grade: '3',
        registrationCode: existingCode
      });

      // Mock generateRegistrationCode to return the existing code first, then a new one
      const originalGenerate = User.generateRegistrationCode;
      let callCount = 0;
      User.generateRegistrationCode = jest.fn(() => {
        callCount++;
        return callCount === 1 ? existingCode : 'XYZ789';
      });

      const uniqueCode = await User.generateUniqueRegistrationCode();
      expect(uniqueCode).toBe('XYZ789');
      expect(User.generateRegistrationCode).toHaveBeenCalledTimes(2);

      // Restore original function
      User.generateRegistrationCode = originalGenerate;
    });

    test('should throw error after max attempts', async () => {
      // Mock generateRegistrationCode to always return the same code
      const originalGenerate = User.generateRegistrationCode;
      User.generateRegistrationCode = jest.fn(() => 'ABC123');

      // Create a user with that code
      await User.create({
        fullName: 'Existing User',
        role: 'learner',
        grade: '3',
        registrationCode: 'ABC123'
      });

      await expect(User.generateUniqueRegistrationCode()).rejects.toThrow('Unable to generate unique registration code');

      // Restore original function
      User.generateRegistrationCode = originalGenerate;
    });
  });

  describe('findByRegistrationCode', () => {
    test('should find user by registration code', async () => {
      const testCode = 'TEST01';
      const user = await User.create({
        fullName: 'Test User',
        role: 'learner',
        grade: '4',
        registrationCode: testCode
      });

      const foundUser = await User.findByRegistrationCode(testCode);
      expect(foundUser).not.toBeNull();
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.registrationCode).toBe(testCode);
    });

    test('should return null for non-existent code', async () => {
      const foundUser = await User.findByRegistrationCode('NOTFOUND');
      expect(foundUser).toBeNull();
    });

    test('should be case sensitive', async () => {
      const testCode = 'TEST01';
      await User.create({
        fullName: 'Test User',
        role: 'learner',
        grade: '4',
        registrationCode: testCode
      });

      const foundUser = await User.findByRegistrationCode('test01');
      expect(foundUser).toBeNull();
    });
  });

  describe('User Creation', () => {
    test('should create learner with registration code', async () => {
      const registrationCode = await User.generateUniqueRegistrationCode();
      const user = await User.create({
        fullName: 'Test Learner',
        role: 'learner',
        grade: '3',
        age: 9,
        registrationCode
      });

      expect(user.fullName).toBe('Test Learner');
      expect(user.role).toBe('learner');
      expect(user.grade).toBe('3');
      expect(user.age).toBe(9);
      expect(user.registrationCode).toBe(registrationCode);
      expect(user.totalPoints).toBe(0); // Default value
    });

    test('should create teacher without registration code', async () => {
      const user = await User.create({
        fullName: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher'
      });

      expect(user.fullName).toBe('Test Teacher');
      expect(user.role).toBe('teacher');
      expect(user.email).toBe('teacher@test.com');
      expect(user.registrationCode).toBeNull();
    });

    test('should enforce unique registration code constraint', async () => {
      const code = 'UNIQUE';
      
      await User.create({
        fullName: 'First User',
        role: 'learner',
        grade: '3',
        registrationCode: code
      });

      await expect(User.create({
        fullName: 'Second User',
        role: 'learner',
        grade: '4',
        registrationCode: code
      })).rejects.toThrow();
    });

    test('should validate registration code length', async () => {
      await expect(User.create({
        fullName: 'Test User',
        role: 'learner',
        grade: '3',
        registrationCode: 'SHORT' // Only 5 characters
      })).rejects.toThrow();

      await expect(User.create({
        fullName: 'Test User',
        role: 'learner',
        grade: '3',
        registrationCode: 'TOOLONGCODE' // More than 10 characters
      })).rejects.toThrow();
    });

    test('should allow null registration code', async () => {
      const user = await User.create({
        fullName: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher',
        registrationCode: null
      });

      expect(user.registrationCode).toBeNull();
    });
  });

  describe('User Validation', () => {
    test('should require fullName', async () => {
      await expect(User.create({
        role: 'learner',
        grade: '3'
      })).rejects.toThrow();
    });

    test('should require role', async () => {
      await expect(User.create({
        fullName: 'Test User'
      })).rejects.toThrow();
    });

    test('should validate role enum', async () => {
      await expect(User.create({
        fullName: 'Test User',
        role: 'invalid_role'
      })).rejects.toThrow();
    });

    test('should set default totalPoints to 0', async () => {
      const user = await User.create({
        fullName: 'Test User',
        role: 'learner',
        grade: '3'
      });

      expect(user.totalPoints).toBe(0);
    });

    test('should set default role to learner', async () => {
      const user = await User.create({
        fullName: 'Test User'
      });

      expect(user.role).toBe('learner');
    });
  });
});
