const { check } = require('express-validator');

module.exports = {
  loginValidationRules: () => {
    return [
      check('name', ' Name is required').not().isEmpty().trim(),
      check('email', 'email  is required').not().isEmpty().trim(),
    ];
  },
  registerValidationRules: () => {
    return [
      check('name', ' Name is required').not().isEmpty().trim(),
      check('email', 'email  is required').not().isEmpty().trim(),
      check('password', 'password  is required').not().isEmpty().trim(),
    ];
  },
};
