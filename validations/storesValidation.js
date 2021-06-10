const { check } = require('express-validator');

module.exports.storesValidationRules = () => {
  return [
    check('name', 'Store Name is required').not().isEmpty().trim(),
    check('title', 'Store Title is required').not().isEmpty().trim(),
    check('logo', 'Store Logo is required').not().isEmpty().trim(),
  ];
};
