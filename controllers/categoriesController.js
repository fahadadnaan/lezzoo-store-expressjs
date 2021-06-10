require('dotenv').config();
const models = require('../models');
const base64ToImage = require('../helpers/base64ToImage');

let iteamsPerPage = parseInt(process.env.ITEAMS_PER_PAGE);
const imageDir = `public/categories_images/`;

module.exports = {
  // Get all Categories
  getCategories: async (req, res, next) => {
    const { page = 1 } = req.query;
    const { storeId } = req.params;
    let query = {
      page: page,
      paginate: iteamsPerPage,
      order: [['createdAt', 'DESC']],
      where: { store_id: storeId },
    };
    try {
      const categories = await models.categories.paginate(query);
      return res.status(200).send({
        status: 200,
        data: categories.docs,
        pages: categories.pages,
        total: categories.total,
        per_page: parseInt(iteamsPerPage),
        current_page: parseInt(page),
        last_page: Math.ceil(categories.total / iteamsPerPage),
      });
    } catch (error) {
      return next(error);
    }
  },

  // create Category
  createCategory: async (req, res, next) => {
    const { storeId } = req.params;

    const { name, image } = req.body;
    try {
      const store = await models.categories.create(
        {
          name,
          image: await base64ToImage.storeIamgeLocal(image, imageDir),
          store_id: storeId,
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

  // update Category
  updateCategory: async (req, res, next) => {
    const { name, image, imageBase64 } = req.body;
    const { id, storeId } = req.params;
    try {
      const category = await models.categories.update(
        {
          name,
          image:
            imageBase64 != null
              ? await base64ToImage.storeIamgeLocal(imageBase64, imageDir)
              : image,
          store_id: storeId,
        },
        {
          where: {
            id,
          },
          returning: true,
          plain: true,
        }
      );
      if (category[1] === 1) {
        const findNewCategory = await models.categories.findByPk(id);
        if (imageBase64 != null) {
          await base64ToImage.deleteIamge(image, imageDir);
        }
        return res.status(200).send({
          status: 200,
          data: findNewCategory,
        });
      }
      return res.status(404).send({ status: 404, error: 'Not Found' });
    } catch (error) {
      return next(error);
    }
  },

  // destroy the Category
  deleteCategory: async (req, res, next) => {
    const { id } = req.params;
    try {
      const findCategory = await models.categories.findByPk(id);
      if (findCategory) {
        const deleted = await models.categories.destroy({
          where: {
            id,
          },
        });
        if (deleted) {
          await base64ToImage.deleteIamge(findCategory.image, imageDir);
          return res.status(200).send({ status: 200 });
        }
      } else {
        return res.status(404).send({ status: 404, error: 'Not Found' });
      }
    } catch (error) {
      return next(error);
    }
  },
};
