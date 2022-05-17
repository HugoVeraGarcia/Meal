const { Restaurant } = require('../models/restaurant.model');
const { User } = require('../models/user.model');
const { Review } = require('../models/review.model');
const { AppError } = require('../utils/appError');

// utils
const { catchAsync } = require('../utils/catchAsync');

const getAllRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findAll({
    where: { status: 'active' },
    include: {
      model: Review,
      where: { status: 'active' },
      attributes: {
        exclude: ['id', 'userId', 'restaurantId', 'createdAt', 'updatedAt'],
      },
    },
  });
  res.status(200).json({
    restaurant,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    restaurant,
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { id } = req.params;
  const { sessionUser } = req;

  const review = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: id,
    rating,
  });
  res.status(201).json({ review });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;
  const restaurant = await Restaurant.create({
    name,
    address,
    rating,
  });
  res.status(201).json({ restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({ name, address }, { where: { status: 'active' } });

  res.status(200).json({ status: 'success' });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { comment, rating } = req.body;
  const { sessionUser } = req;

  const review = await Review.findOne({ where: { id, restaurantId } });

  if (!review) {
    return next(new AppError(`Review not found `, 404));
  }

  // Compare the id's
  if (sessionUser.id !== review.userId) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this review', 403));
  }

  await review.update({ comment, rating });

  //add user data to request
  req.review = review;

  res.status(200).json({ status: 'success', review });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;

  const review = await Review.findOne({ where: { id, restaurantId } });

  if (!review) {
    return next(new AppError(`Review not found `, 404));
  }

  // Compare the id's
  if (sessionUser.id !== review.userId) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this review', 403));
  }

  await review.update({ status: 'deleted' });

  //add user data to request
  req.review = review;

  res.status(200).json({
    status: 'success',
    message: 'The review has been deleted',
    review,
  });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: 'Restaurant has been deleted',
  });
});

module.exports = {
  getAllRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
