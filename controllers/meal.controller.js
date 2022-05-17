//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const dotenv = require('dotenv');
//const { AppError } = require('../utils/appError');

//models
//const { User } = require('../models/user.model');
//const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
//const { user } = require('pg/lib/defaults');

const getAllMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findAll({
    where: { status: 'active' },
    include: {
      model: Restaurant,
      where: { status: 'active' },
    },
  });
  res.status(200).json({
    meal,
  });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
    include: {
      model: Restaurant,
      where: { status: 'active' },
    },
  });

  res.status(200).json({ meal });
});

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const meal = await Meal.create({ name, price, restaurantId: id });

  res.status(201).json({
    status: 'Success',
    message: 'Meal has been created',
    meal,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const meal = await Meal.findOne({
    where: { id },
  });

  meal.update({ name, price });
  res.status(200).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({ where: { id } });

  await meal.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: `Meal account has been deleted`,
  });
});

module.exports = {
  createMeal,
  getAllMeal,
  getMealById,
  updateMeal,
  deleteMeal,
};
