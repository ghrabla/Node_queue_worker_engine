const express = require('express');
const router = express.Router();

const RegisterController = require('../../app/Controllers/Auth/RegisterController');
const LoginController = require('../../app/Controllers/Auth/LoginController');
const LogoutController = require('../../app/Controllers/Auth/LogoutController');
const { authenticateToken } = require('../../app/Middlewares/Jwt/authenticateToken');

const registerController = new RegisterController();
const loginController = new LoginController();
const logoutController = new LogoutController();

router.post('/register', (req, res) => registerController.register(req, res));
router.post('/login', (req, res) => loginController.login(req, res));

router.post('/logout', authenticateToken, (req, res) => logoutController.logout(req, res));
router.get('/me', authenticateToken, (req, res) => logoutController.me(req, res));

module.exports = router;