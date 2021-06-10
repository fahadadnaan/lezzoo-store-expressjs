'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    static associate(models) {
      categories.belongsTo(models.stores, {
        foreignKey: 'store_id',
        as: 'store',
        allowNull: false,
      });
      categories.hasMany(models.products, {
        foreignKey: 'category_id',
        as: 'products',
        onDelete: 'CASCADE',
        allowNull: false,
      });
    }
  }
  categories.init(
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      store_id: {
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
            .format('YYYY-MM-DD, h:s A');
        },
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        get: function () {
          return moment
            .utc(this.getDataValue('updatedAt'))
            .format('YYYY-MM-DD, h:s A');
        },
      },
    },

    {
      sequelize,
      modelName: 'categories',
      timestamps: true,
    }
  );
  sequelizePaginate.paginate(categories);

  return categories;
};
