const router = require('express').Router();
const authController = require('../controllers/authController');
const authValidation = require('../validations/authValidation');
const { validate } = require('../validations/validate');

module.exports = (app) => {
  // get all login
  router
    .route('/login')
    .post(
      authValidation.loginValidationRules(),
      validate,
      authController.login
    );

  // create new user
  router
    .route('/register')
    .post(
      authValidation.registerValidationRules(),
      validate,
      authController.register
    );

  app.use(router);
};
