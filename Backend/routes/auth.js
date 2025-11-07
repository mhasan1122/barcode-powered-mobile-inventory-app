const express = require('express');
const router = express.Router();
const {
  register,
  login,
} = require('../controllers/authController');
const {
  validateRegistration,
  validateLogin,
} = require('../middleware/validation');

// Registration route
router.post('/register', validateRegistration, register);

// Login route
router.post('/login', validateLogin, login);

module.exports = router;

