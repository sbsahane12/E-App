const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const setUser = require('./middleware/setUser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(setUser);



app.use('/', require('./routes/auth'));
app.use('/', require('./routes/user'));
app.use('/admin', require('./routes/admin'));

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error', { message });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
