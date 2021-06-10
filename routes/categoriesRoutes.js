const router = require('express').Router();
const categoriesController = require('../controllers/categoriesController');
const {
  categoryValidationRules,
} = require('../validations/categoriesValidation');
const { validate } = require('../validations/validate');
const { checkToken } = require('../lib/token/JWT');

module.exports = (app) => {
  // get all categories
  router
    .route('/store/:storeId/categories')
    .get(checkToken, categoriesController.getCategories);

  // create new category
  router
    .route('/store/:storeId/categories')
    .post(
      checkToken,
      categoryValidationRules(),
      validate,
      categoriesController.createCategory
    );

  // Update existing category
  router
    .route('/store/:storeId/categories/:id')
    .put(
      checkToken,
      categoryValidationRules(),
      validate,
      categoriesController.updateCategory
    );

  // Delete existing store
  router
    .route('/store/:storeId/categories/:id')
    .delete(checkToken, categoriesController.deleteCategory);
  app.use(router);
};
