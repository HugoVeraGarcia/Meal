const { Restaurant } = require('../models/restaurant.model');
const { User } = require('../models/user.model');
// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const restaurantExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError(`Restaurant not found given that id: ${id}`, 404));
  }

  //add user data to request
  req.restaurant = restaurant;

  next();
});

module.exports = { restaurantExist };
