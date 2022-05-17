const jwt = require('jsonwebtoken');
const { Meal } = require('../models/meal.model');
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectToken = catchAsync(async (req, res, next) => {
  let token;

  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // ['Bearer', 'token']
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  // Validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const mealExits = catchAsync(async (req, res, next) => {
  const { mealId, quantity } = req.body;

  const meal = await Meal.findOne({
    where: { id: mealId, status: 'active' },
  });

  if (!meal) {
    return next(new AppError(`Meal not found`, 404));
  }

  // Add user data to the req object
  req.meal = meal;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the user that is going to be updated
  const { sessionUser, user } = req;

  // Compare the id's
  if (sessionUser.id !== req.order.userId) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

const orderExits = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, status: 'active' },
  });

  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }

  // Add user data to the req object
  req.order = order;
  next();
});

module.exports = {
  protectToken,
  protectAccountOwner,
  mealExits,
  orderExits,
};
