const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
router.get('/user/dashboard', authMiddleware, (req, res) => {
  res.render('user/home');
});
router.get('/user/items', authMiddleware, userController.getItems);
router.post('/user/items/viewBill', authMiddleware, userController.viewBill);
router.post(
  '/user/items/placeOrder',
  authMiddleware,
  userController.placeOrder,
);
router.get(
  '/user/orderHistory',
  authMiddleware,
  userController.getOrderHistory,
);
router.get('/user/rewardPoints', authMiddleware, userController.rewardPoints);

module.exports = router;
