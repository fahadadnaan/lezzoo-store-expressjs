const { check } = require('express-validator');

module.exports.productValidationRules = () => {
  return [
    check('name', 'Product Name is required').not().isEmpty().trim(),
    check('image', 'Product Image is required').not().isEmpty().trim(),
    check('price', 'Product Price is required').not().isEmpty().trim(),
  ];
};
