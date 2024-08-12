const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware, } = require('../middleware/auth');

router.get('/dashboard',authMiddleware, adminMiddleware, adminController.getDashboard);
router.get('/orders/today',authMiddleware, adminMiddleware, adminController.getTodayOrders);
router.get('/orders/:userId',authMiddleware, adminMiddleware, adminController.getOrdersForUser);
router.get(
  '/orders/last7days/pending',authMiddleware, adminMiddleware,
  adminController.getLast7DaysPendingOrders,
);
router.post('/orders/:orderId/update',authMiddleware, adminMiddleware, adminController.updateOrder);
router.post('/orders/:orderId/delete',authMiddleware, adminMiddleware, adminController.deleteOrder);

router.get('/items',authMiddleware, adminMiddleware, adminController.manageItems);
router.post('/items/create',authMiddleware, adminMiddleware, adminController.createItem);
router.post('/items/:itemId/update',authMiddleware, adminMiddleware, adminController.updateItem);
router.post('/items/:itemId/delete',authMiddleware, adminMiddleware, adminController.deleteItem);

module.exports = router;
