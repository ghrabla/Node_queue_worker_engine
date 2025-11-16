const jwt = require('jsonwebtoken');
const UserService = require('../../Services/UserService');

class RegisterController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res) {
    try {
      const { name, email, password, confirm_password } = req.body;

      if (!name || !email || !password || !confirm_password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      if (password !== confirm_password) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      const user = await this.userService.createUser({ name, email, password });

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
        }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token,
          token_type: 'Bearer'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);

      if (error.message.includes('Email already exists')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = RegisterController;