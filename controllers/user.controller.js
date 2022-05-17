const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { AppError } = require('../utils/appError');

//models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { user } = require('pg/lib/defaults');

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

const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: { id, userId: sessionUser.id },
    include: { model: Meal, include: { model: Restaurant } },
  });

  res.status(200).json({ order });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashPassword, role });

  user.password = undefined;

  res.status(201).json({
    status: 'Success',
    message: 'User has been created',
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });
  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: `User account has been deleted`,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllOrder,
  getOrderById,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
