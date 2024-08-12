// middleware/setUser.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const setUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        res.locals.user = user;
      } else {
        res.locals.user = null;
      }
    } catch (err) {
      console.error(err);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = setUser;
