require('dotenv').config();
const models = require('../models');
const base64ToImage = require('../helpers/base64ToImage');

let iteamsPerPage = parseInt(process.env.ITEAMS_PER_PAGE);
const logoDir = `public/stores_logo/`;

module.exports = {
  // Get all Stores
  getStores: async (req, res, next) => {
    const { page = 1 } = req.query;
    let query = {
      page: page,
      paginate: iteamsPerPage,
      order: [['createdAt', 'DESC']],
    };
    try {
      const stores = await models.stores.paginate(query);
      return res.status(200).send({
        status: 200,
        data: stores.docs,
        pages: stores.pages,
        total: stores.total,
        per_page: parseInt(iteamsPerPage),
        current_page: parseInt(page),
        last_page: Math.ceil(stores.total / iteamsPerPage),
      });
    } catch (error) {
      return next(error);
    }
  },

  // create Store
  createStore: async (req, res, next) => {
    const { name, title, logo } = req.body;
    try {
      const store = await models.stores.create(
        {
          name,
          title,
          logo: await base64ToImage.storeIamgeLocal(logo, logoDir),
        },
        {
          returning: true,
          plain: true,
        }
      );

      return res.status(201).send({
        status: 201,
        data: store,
      });
    } catch (error) {
      return next(error);
    }
  },

  // update Store
  updateStore: async (req, res, next) => {
    const { name, title, logoBase64, logo } = req.body;
    const { id } = req.params;
    try {
      const store = await models.stores.update(
        {
          name,
          title,
          logo:
            logoBase64 != null
              ? await base64ToImage.storeIamgeLocal(logoBase64, logoDir)
              : logo,
        },
        {
          where: {
            id,
          },
          returning: true,
          plain: true,
        }
      );
      if (store[1] === 1) {
        const findNewStore = await models.stores.findByPk(id);
        if (logoBase64 != null) {
          await base64ToImage.deleteIamge(logo, logoDir);
        }

        return res.status(200).send({
          status: 200,
          data: findNewStore,
        });
      }
      return res.status(404).send({ status: 404, error: 'Not Found' });
    } catch (error) {
      return next(error);
    }
  },

  // destroy the Store
  deleteStore: async (req, res, next) => {
    const { id } = req.params;
    try {
      const findStore = await models.stores.findByPk(id);
      if (findStore) {
        const deleted = await models.stores.destroy({
          where: {
            id,
          },
        });
        if (deleted) {
          await base64ToImage.deleteIamge(findStore.logo, logoDir);

          return res.status(200).send({
            status: 200,
          });
        }
      } else {
        return res.status(404).send({ status: 404, error: 'Not Found' });
      }
    } catch (error) {
      return next(error);
    }
  },
};
