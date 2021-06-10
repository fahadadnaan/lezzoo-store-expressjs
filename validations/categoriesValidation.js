const { check } = require('express-validator');

module.exports.categoryValidationRules = () => {
  return [
    check('name', 'Category Name is required').not().isEmpty().trim(),
    check('image', 'Category Image is required').not().isEmpty().trim(),
  ];
};
