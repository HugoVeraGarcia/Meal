const express = require('express');

//middleware
const {
  protectToken,
  protectAccountOwner,
  mealExits,
  orderExits,
} = require('../middlewares/orders.middlewares');

//import controller functions
const {
  createOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller');

//router declaration
const router = express.Router();

// Apply protectToken middleware
router.use(protectToken);

router.post('/', mealExits, createOrder);

router.get('/me', getAllOrder);

router
  .route('/:id')
  .patch(orderExits, protectAccountOwner, updateOrder)
  .delete(orderExits, protectAccountOwner, deleteOrder);

module.exports = { ordersRouter: router };
