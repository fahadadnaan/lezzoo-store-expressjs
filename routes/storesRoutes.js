const router = require('express').Router();
const storesController = require('../controllers/storesController');
const { storesValidationRules } = require('../validations/storesValidation');
const { validate } = require('../validations/validate');
const { checkToken } = require('../lib/token/JWT');

module.exports = (app) => {
  // get all stores
  router.route('/stores').get(checkToken, storesController.getStores);

  // create new store
  router
    .route('/stores')
    .post(
      checkToken,
      storesValidationRules(),
      validate,
      storesController.createStore
    );

  // Update existing store
  router
    .route('/stores/:id')
    .put(
      checkToken,
      storesValidationRules(),
      validate,
      storesController.updateStore
    );

  // Delete existing store
  router.route('/stores/:id').delete(checkToken, storesController.deleteStore);
  app.use(router);
};
