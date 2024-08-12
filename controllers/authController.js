const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.cookie('token', token);
      if (user.role === 'admin') {
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/user/dashboard');
      }
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

module.exports = { register, login, logout };
