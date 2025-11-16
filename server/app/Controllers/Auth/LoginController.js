const jwt = require('jsonwebtoken');
const UserService = require('../../Services/UserService');

class LoginController {
  constructor() {
    this.userService = new UserService();
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.authenticateUser(email, password);

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

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          token_type: 'Bearer'
        }
      });

    } catch (error) {
      console.error('Login error:', error);

      if (error.message.includes('Invalid credentials')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = LoginController;