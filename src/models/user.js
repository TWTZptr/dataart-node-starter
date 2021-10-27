'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatar_url',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        afterCreate: (user) => {
          delete user.dataValues.password;
        },
        afterUpdate: (user) => {
          delete user.dataValues.password;
        },
      },
    },
  );
  return User;
};
