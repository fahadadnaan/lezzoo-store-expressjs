const bcrypt = require('bcrypt');

module.exports = {
  verifyPassword: (password, hash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function (err, result) {
        if (err) return reject(false);
        if (result) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  },
  generateNewPassword: (myPlaintextPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (error, salt) => {
        if (error) return reject(error);
        bcrypt.hash(myPlaintextPassword, salt, (error, hash) => {
          if (error) return reject(error);
          return resolve(hash);
        });
      });
    });
  },
};
