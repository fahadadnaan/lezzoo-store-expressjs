const models = require('../models');
const {
  verifyPassword,
  generateNewPassword,
} = require('../lib/password/Password');
const { generateToken } = require('../lib/token/JWT');

module.exports = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await models.users.findOne({
        where: { email },
      });
      if (!user) {
        return res.status(404).send({
          status: 404,
          message: 'please check the email and password ',
        });
      }
      const authenticated = await verifyPassword(
        password,
        user.dataValues.password
      );
      console.log(authenticated);
      if (authenticated) {
        const currentUser = {
          id: parseInt(user.id),
          name: `${user.name}`,
          email: `${user.email}`,
          accessToken: generateToken(user),
        };
        return res.status(200).send({
          status: 200,
          message: 'successfully login',
          currentUser,
        });
      } else {
        return res.status(404).send({
          status: 404,
          message: 'please check the email and password ',
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  register: async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
      const user = await models.users.findOne({
        where: { email },
      });

      if (user != null) {
        return res.status(404).send({
          status: 404,
          message: 'user already exist ',
        });
      }
      const hashPassword = await generateNewPassword(password);
      const newUser = await models.users.create(
        {
          name,
          email,
          password: hashPassword,
        },
        {
          returning: true,
          plain: true,
        }
      );
      if (newUser) {
        const currentUser = {
          id: parseInt(newUser.id),
          name: `${newUser.name}`,
          email: `${newUser.email}`,
          accessToken: generateToken(newUser),
        };
        return res.status(200).send({
          status: 200,
          message: 'successfully login',
          currentUser,
        });
      } else {
        return res.status(500).send({
          status: 500,
          message: 'there was an error occurred ',
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};
