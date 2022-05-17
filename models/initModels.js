// Models
const { Restaurant } = require('./restaurant.model');
const { User } = require('./user.model');
const { Meal } = require('./meal.model');
const { Order } = require('./order.model');
const { Review } = require('./review.model');

const initModels = () => {
  // one restaurant <–—> many meal
  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  // one meal <–—> one order
  Meal.hasOne(Order);
  Order.belongsTo(Meal);

  // one user <–—> many order
  User.hasMany(Order);
  Order.belongsTo(User);

  // one user <–—> many reviews
  User.hasMany(Review);
  Review.belongsTo(User);

  // one restaurant <–—> many reviews
  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);
};

module.exports = { initModels };
