'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    static associate(models) {
      products.belongsTo(models.categories, {
        foreignKey: 'category_id',
        as: 'category',
        allowNull: false,
      });
    }
  }
  products.init(
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'categories',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get: function () {
          return moment
            .utc(this.getDataValue('createdAt'))
            .format('YYYY-MM-DD, h:m:s A');
        },
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get: function () {
          return moment
            .utc(this.getDataValue('updatedAt'))
            .format('YYYY-MM-DD, h:m:s A');
        },
      },
    },
    {
      sequelize,
      modelName: 'products',
      timestamps: true,
    }
  );
  sequelizePaginate.paginate(products);

  return products;
};
