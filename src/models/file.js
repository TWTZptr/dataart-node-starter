'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  File.init(
    {
      s3key: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        field: 'owner_id',
      },
      extension: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'original_name',
      },
    },
    {
      sequelize,
      modelName: 'File',
    },
  );
  return File;
};
