const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');

const {
  createUserValidations,
  loginValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createUser,
  login,
  updateUser,
  deleteUser,
  getAllOrder,
  getOrderById,
} = require('../controllers/user.controller');

//router declaration
const router = express.Router();

router.post('/sign-up', createUserValidations, checkValidations, createUser);
router.post('/login', loginValidations, checkValidations, login);

// Apply protectToken middleware
router.use(protectToken);

router.get('/orders', getAllOrder);

router.get('/orders/:id', getOrderById);

router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
