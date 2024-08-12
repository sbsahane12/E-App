const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    selectedCategory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Item', itemSchema);
