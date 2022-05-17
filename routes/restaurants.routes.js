const express = require('express');
const { body } = require('express-validator');

//middleware
const { restaurantExist } = require('../middlewares/restaurants.middlewares');
const {
  protectToken,
  protectAdmin,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');

const {
  createRestaurantValidations,
  checkValidations,
  createReviewValidations,
} = require('../middlewares/validations.middlewares');

const {
  getAllRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurant.controller');

//router declaration
const router = express.Router();

router.get('/', getAllRestaurant);

router.get('/:id', restaurantExist, getRestaurantById);

// Apply protectToken middleware
router.use(protectToken);

router.post(
  '/',
  createRestaurantValidations,
  checkValidations,
  protectAdmin,
  createRestaurant
);

router.patch('/:id', restaurantExist, protectAdmin, updateRestaurant);
router.delete('/:id', restaurantExist, protectAdmin, deleteRestaurant);

router.post(
  '/reviews/:id',
  createReviewValidations,
  checkValidations,
  createReview
);
router.patch(
  '/reviews/:restaurantId/:id',
  createReviewValidations,
  checkValidations,
  updateReview
);
router.delete('/reviews/:restaurantId/:id', deleteReview);

module.exports = { restaurantsRouter: router };
