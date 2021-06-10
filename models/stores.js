'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class stores extends Model {
    static associate(models) {
      stores.hasMany(models.categories, {
        foreignKey: 'store_id',
        as: 'categories',
        onDelete: 'CASCADE',
        allowNull: false,
      });
    }
  }
  stores.init(
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: 'stores',
      timestamps: true,
    }
  );
  sequelizePaginate.paginate(stores);
  return stores;
};
