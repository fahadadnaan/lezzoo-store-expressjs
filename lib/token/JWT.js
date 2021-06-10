const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = process.env.JWT_SECRET;

module.exports = {
  // Generate new token
  generateToken: (user) => {
    const expires = moment().add(999, 'years').valueOf();
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return jwt.sign(
      {
        exp: expires,
        user: payload,
      },
      secret
    );
  },

  // Verify request token
  checkToken: (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    try {
      if (token) {
        jwt.verify(
          token,
          secret,
          {
            ignoreExpiration: true,
          },
          (err, decoded) => {
            if (err) {
              return res.status(401).send({
                status: 401,
                message: 'Not Authorized',
              });
            } else {
              req.decoded = decoded;
              next();
            }
          }
        );
      } else {
        return res.status(401).send({
          status: 401,
          message: 'Not Authorized',
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  // get user from request token
  authUser: (token) => {
    return jwt.verify(token, secret, {
      ignoreExpiration: true,
    });
  },
};
