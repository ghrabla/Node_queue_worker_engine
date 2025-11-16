const bcrypt = require('bcrypt');
const UserRepository = require('../Repositories/UserRepository');
const User = require('../Models/User');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return users.map(user => user.toSafeObject());
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      return user.toSafeObject();
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Name, email, and password are required');
      }

      const emailExists = await this.userRepository.emailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await this.userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });

      return user.toSafeObject();
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  async updateUser(id, userData) {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      if (userData.email) {
        const emailExists = await this.userRepository.emailExists(userData.email, id);
        if (emailExists) {
          throw new Error('Email already exists');
        }
      }

      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const updatedUser = await this.userRepository.update(id, userData);
      return updatedUser.toSafeObject();
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const deleted = await this.userRepository.delete(id);
      return { success: deleted, message: deleted ? 'User deleted successfully' : 'Failed to delete user' };
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  async getUsersWithPagination(page = 1, limit = 10) {
    try {
      const result = await this.userRepository.findWithPagination(page, limit);
      
      return {
        users: result.users.map(user => user.toSafeObject()),
        pagination: result.pagination
      };
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  async authenticateUser(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.getPassword());
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return user.toSafeObject();
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }
}

module.exports = UserService;