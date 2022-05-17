const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  protectToken,
  protectAdmin,
} = require('../middlewares/users.middlewares');

const {
  createMealValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createMeal,
  getAllMeal,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controller');

//router declaration
const router = express.Router();

router.get('/', getAllMeal);
router.get('/:id', getMealById);

// Apply protectToken middleware
router.use(protectToken);

router.post(
  '/:id',
  protectAdmin,
  createMealValidations,
  checkValidations,
  createMeal
);

router
  .route('/:id')
  .patch(protectAdmin, updateMeal)
  .delete(protectAdmin, deleteMeal);

module.exports = { mealsRouter: router };
