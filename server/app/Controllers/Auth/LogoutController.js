class LogoutController {
  async logout(req, res) {
    try {
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async me(req, res) {
    try {
      const user = await new (require('../../Services/UserService'))().getUserById(req.user.id);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: {
          user
        }
      });

    } catch (error) {
      console.error('Get user error:', error);

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = LogoutController;