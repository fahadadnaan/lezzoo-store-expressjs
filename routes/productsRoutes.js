const router = require('express').Router();
const productsController = require('../controllers/productsController');
const { productValidationRules } = require('../validations/productsValidation');
const { validate } = require('../validations/validate');
const { checkToken } = require('../lib/token/JWT');

module.exports = (app) => {
  // get all products
  router
    .route('/categories/:categoryId/products')
    .get(checkToken, productsController.getProducts);

  // create new product
  router
    .route('/categories/:categoryId/products')
    .post(
      checkToken,
      productValidationRules(),
      validate,
      productsController.createProduct
    );

  // Update existing product
  router
    .route('/categories/:categoryId/products/:id')
    .put(
      checkToken,
      productValidationRules(),
      validate,
      productsController.updateProduct
    );

  // Delete existing product
  router
    .route('/categories/:categoryId/products/:id')
    .delete(checkToken, productsController.deleteProduct);
  app.use(router);
};
