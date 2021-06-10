require('dotenv').config();
const models = require('../models');
const base64ToImage = require('../helpers/base64ToImage');

let iteamsPerPage = parseInt(process.env.ITEAMS_PER_PAGE);
const imageDir = `public/products_images/`;

module.exports = {
  // Get all Products
  getProducts: async (req, res, next) => {
    const { page = 1 } = req.query;
    const { categoryId } = req.params;
    let query = {
      page: page,
      paginate: iteamsPerPage,
      order: [['createdAt', 'DESC']],
      where: { category_id: categoryId },
    };
    try {
      const categories = await models.products.paginate(query);
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

  // create Product
  createProduct: async (req, res, next) => {
    const { categoryId } = req.params;

    const { name, image, price, description } = req.body;
    try {
      const product = await models.products.create(
        {
          name,
          image: await base64ToImage.storeIamgeLocal(image, imageDir),
          price,
          description,
          category_id: categoryId,
        },
        {
          returning: true,
          plain: true,
        }
      );
      return res.status(201).send({
        status: 201,
        data: product,
      });
    } catch (error) {
      return next(error);
    }
  },

  // update Product
  updateProduct: async (req, res, next) => {
    const { name, image, imageBase64, price, description } = req.body;
    const { id, categoryId } = req.params;
    try {
      const product = await models.products.update(
        {
          name,
          image:
            imageBase64 != null
              ? await base64ToImage.updateIamgeLocal(
                  imageBase64,
                  image,
                  imageDir
                )
              : image,
          price,
          description,
          category_id: categoryId,
        },
        {
          where: {
            id,
          },
          returning: true,
          plain: true,
        }
      );
      if (product[1] === 1) {
        const findNewProduct = await models.products.findByPk(id);
        // if (imageBase64 != null) {
        //   await base64ToImage.deleteIamge(image, imageDir);
        // }
        return res.status(200).send({
          status: 200,
          data: findNewProduct,
        });
      }
      return res.status(404).send({ status: 404, error: 'Not Found' });
    } catch (error) {
      return next(error);
    }
  },

  // destroy the Product
  deleteProduct: async (req, res, next) => {
    const { id } = req.params;
    try {
      const findProduct = await models.products.findByPk(id);
      if (findProduct) {
        const deleted = await models.products.destroy({
          where: {
            id,
          },
        });
        if (deleted) {
          await base64ToImage.deleteIamge(findProduct.image, imageDir);
          return res.status(204).send({ status: 204 });
        }
      } else {
        return res.status(404).send({ status: 404, error: 'Not Found' });
      }
    } catch (error) {
      return next(error);
    }
  },
};
