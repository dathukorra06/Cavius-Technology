const express = require('express');
const router = express.Router();
const {
  register, login, getMe, updateProfile, logout, changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../utils/validators');

router.post('/register', validateRegister, register);
router.post('/login',    validateLogin,    login);
router.get('/me',        protect,          getMe);
router.put('/profile',   protect,          updateProfile);
router.post('/logout',   protect,          logout);
router.post('/change-password', protect,   changePassword);

module.exports = router;
