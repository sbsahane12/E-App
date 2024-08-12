const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
