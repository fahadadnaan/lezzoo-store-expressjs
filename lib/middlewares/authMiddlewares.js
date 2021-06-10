const { authUser } = require('../token/JWT');

module.exports = {
  authUserMiddleware: (req, res, next) => {
    const { user } = authUser(
      req.headers['x-access-token'] || req.headers['authorization']
    );
    try {
      if (user) {
        next();
      } else {
        return res.sendStatus(401);
      }
    } catch (error) {
      next(500);
    }
  },
};
