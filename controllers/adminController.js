const User = require('../models/user');
const Order = require('../models/order');
const Item = require('../models/item');
const Category = require('../models/category');
const getDashboard = async (req, res) => {
  const users = await User.find({ role: 'user' });
  res.render('admin/dashboard', { users });
};

const getOrdersForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const orders = await Order.find({ user: req.params.userId }).populate({
      path: 'items.item',
      populate: {
        path: 'categories',
        model: 'Category',
      },
    });

    res.render('admin/orders', { orders, user });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    await Order.findByIdAndUpdate(req.params.orderId, updateData);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.orderId);
  res.redirect('/admin/dashboard');
};

const manageItems = async (req, res) => {
  const items = await Item.find().populate('categories');
  res.render('admin/items', { items });
};

const createItem = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, categories } = req.body;

    // Split the categories string into an array
    const categoryArr = categories.split(',').map(cat => cat.trim());

    console.log(categoryArr);

    // Prepare an array of category objects
    const categoryObjects = categoryArr.map(cat => {
      const [category, price, rewardPoints] = cat
        .split('-')
        .map(val => val.trim());
      return {
        category,
        price: parseFloat(price), // Convert price to number
        reward: parseFloat(rewardPoints), // Convert rewardPoints to number
      };
    });

    // Save each category into the Category collection
    const savedCategories = await Category.insertMany(categoryObjects);

    // Create a new item with the saved categories
    const item = new Item({
      name,
      description,
      categories: savedCategories.map(cat => cat._id),
      selectedCategory: savedCategories[0]._id, // Default to the first category as selected
    });

    await item.save();
    res.redirect('/admin/items');
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateItem = async (req, res) => {
  try {
    const { name, description, categories } = req.body;
    const itemId = req.params.itemId;

    // Find the item to update
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).send('Item not found');
    }

    // Process the categories array and find or create them
    const categoryIds = await Promise.all(
      categories.split(',').map(async cat => {
        const [category, price, reward] = cat.trim().split('-');

        // Check if the category already exists
        let existingCategory = await Category.findOne({
          category,
          price: parseFloat(price),
          reward,
        });

        if (!existingCategory) {
          // If the category doesn't exist, create it
          existingCategory = new Category({
            category,
            price: parseFloat(price),
            reward,
          });
          await existingCategory.save();
        }

        return existingCategory._id; // Return the ObjectId of the category
      }),
    );

    // Update the item details, excluding the selectedCategory
    item.name = name;
    item.description = description;
    item.categories = categoryIds;

    // Save the updated item
    await item.save();

    res.redirect('/admin/items');
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.itemId);
  res.redirect('/admin/items');
};

const getLast7DaysPendingOrders = async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const pendingOrders = await Order.find({
    status: 'Pending',
    createdAt: { $gte: sevenDaysAgo },
  });
  res.json(pendingOrders);
};

// Get today's orders
const getTodayOrders = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  console.log(startOfDay, endOfDay);
  const todayOrders = await Order.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
  console.log(todayOrders);
  res.json(todayOrders);
};

module.exports = {
  getDashboard,
  getOrdersForUser,
  updateOrder,
  deleteOrder,
  manageItems,
  createItem,
  updateItem,
  deleteItem,
  getLast7DaysPendingOrders,
  getTodayOrders,
};
