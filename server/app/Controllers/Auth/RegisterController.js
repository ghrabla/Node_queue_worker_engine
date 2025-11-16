const jwt = require('jsonwebtoken');
const UserService = require('../../Services/UserService');

class RegisterController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res) {
    try {
      const { name, email, password, confirm_password } = req.body;

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