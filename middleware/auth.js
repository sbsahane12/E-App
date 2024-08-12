const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) {
    return next(new ExpressError('Access denied.Please Login First.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      // req.flash('error', 'User not found.');
      return next(new ExpressError('User not found.', 404));
    }
    next();
  } catch (err) {
    // req.flash('error', 'Invalid token.');
    next(new ExpressError('Invalid token.', 401));
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.redirect('/login');
    return next(new ExpressError('Access denied. Admins only.', 403));
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
