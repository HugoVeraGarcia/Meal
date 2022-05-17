const { AppError } = require('../utils/appError');

//models
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// utils
const { catchAsync } = require('../utils/catchAsync');

const getAllOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const order = await Order.findAll({
    where: { userId: sessionUser.id },
    include: { model: Meal, include: { model: Restaurant } },
  });
  res.status(200).json({
    order,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const Total = quantity * req.meal.price;

  const order = await Order.create({
    quantity,
    mealId,
    totalPrice: Total,
    userId: req.sessionUser.id,
    status: 'active',
  });

  res.status(201).json({
    status: 'Success',
    message: 'Order has been created',
    order,
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { order } = req;

  await order.update({ status: 'completed' });
  res
    .status(200)
    .json({ status: 'success', message: 'Order has been completed' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(201).json({
    status: 'success',
    message: `Order has been cancelled`,
  });
});

module.exports = {
  createOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
};
