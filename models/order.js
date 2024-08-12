const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    totalRewardPoints: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentOption: {
      type: String,
      enum: ['Cash on Delivery', 'PhonePe'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Order', orderSchema);
