const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = await User.create({ username, email, password, firstName, lastName });
    const token = generateToken(user._id);
    sendSuccess(res, 'Registration successful', {
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token,
    }, 201);
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }
    const token = generateToken(user._id);
    sendSuccess(res, 'Login successful', {
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) { next(err); }
};

// GET /api/auth/me  [Protected]
exports.getMe = async (req, res) => {
  sendSuccess(res, 'User retrieved', req.user);
};

// PUT /api/auth/profile  [Protected]
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, bio, avatar },
      { new: true, runValidators: true }
    );
    sendSuccess(res, 'Profile updated', user);
  } catch (err) { next(err); }
};

// POST /api/auth/logout  [Protected]
exports.logout = (req, res) => {
  sendSuccess(res, 'Logged out successfully');
};

// POST /api/auth/change-password  [Protected]
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return sendError(res, 'Current password is incorrect', 401);
    }
    user.password = newPassword;
    await user.save();
    sendSuccess(res, 'Password changed successfully');
  } catch (err) { next(err); }
};
