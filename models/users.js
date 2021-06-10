'use strict';
const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      password: {
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
      modelName: 'users',
      timestamps: true,
    }
  );
  return users;
};
