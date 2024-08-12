const Order = require('../models/order');
const Item = require('../models/item');
const Category = require('../models/category');

const getItems = async (req, res) => {
  const items = await Item.find().populate('categories');
  res.render('user/items', { items });
};

const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.item') // Populate the item details in each order
      .exec();

    res.render('user/orderHistory', { orders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).send('Internal Server Error');
  }
};

const viewBill = async (req, res) => {
  try {
    const selectedItems = Object.values(req.body.items).filter(
      item => item.selected === 'true',
    ); // Filter only selected items

    console.log(selectedItems);

    if (selectedItems.length === 0) {
      return res.status(400).send('No items selected for billing.');
    }

    const itemIds = selectedItems.map(item => item.itemId);
    const items = await Item.find({ _id: { $in: itemIds } })
      .populate('categories')
      .exec();

    let totalAmount = 0;
    let totalRewardPoints = 0;
    const orderItems = selectedItems.map(item => {
      const foundItem = items.find(i => i._id.toString() === item.itemId);
      const category = foundItem.categories.find(
        cat => cat._id.toString() === item.categoryId,
      );

      if (!foundItem || !category) {
        throw new Error('Item or Category not found');
      }

      const price = category.price;
      const quantity = parseInt(item.quantity);
      const rewardPoints = parseFloat(category.reward) * quantity;
      const itemTotalPrice = price * quantity;

      totalAmount += itemTotalPrice;
      totalRewardPoints += rewardPoints;

      return {
        itemId: item.itemId,
        itemName: foundItem.name,
        categoryId: item.categoryId,
        categoryName: category.category,
        quantity,
        price,
      };
    });

    // Store order details in cookies to avoid redundant API calls
    res.cookie(
      'orderDetails',
      JSON.stringify({ orderItems, totalAmount, totalRewardPoints }),
      { maxAge: 60000 },
    );

    res.render('user/bill', {
      orderItems,
      totalAmount,
      totalRewardPoints,
    });
  } catch (error) {
    console.error('Error displaying bill:', error);
    res.status(500).send('Internal Server Error');
  }
};

const placeOrder = async (req, res) => {
  try {
    const { paymentOption } = req.body;

    console.log(paymentOption);

    if (!req.cookies.orderDetails) {
      return res.status(400).send('No items selected for billing.');
    }

    // if(paymentOption=='')

    // Retrieve order details from cookies
    const { orderItems, totalAmount, totalRewardPoints } = JSON.parse(
      req.cookies.orderDetails,
    );

    const paymentStatus = paymentOption === 'PhonePe' ? 'Completed' : 'Pending';
    console;

    const order = new Order({
      user: req.user._id,
      items: orderItems.map(item => ({
        item: item.itemId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      totalRewardPoints,
      paymentOption,
      paymentStatus,
    });

    await order.save();

    // Clear order details from cookies after order is placed
    res.clearCookie('orderDetails');

    res.redirect('/user/orderHistory');
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Internal Server Error');
  }
};

const rewardPoints = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const orders = await Order.find({ user: req.user._id });
    const totalRewardPoints = orders.reduce(
      (acc, order) => acc + order.totalRewardPoints,
      0,
    );

    res.render('user/reward', { totalRewardPoints }); // Render reward.ejs with totalRewardPoints
  } catch (error) {
    console.error('Error fetching reward points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getItems,
  getOrderHistory,
  viewBill,
  placeOrder,
  rewardPoints,
};
