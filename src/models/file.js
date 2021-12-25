'use strict';
const { Model } = require('sequelize');
const { generateS3link } = require('../helpers/s3');
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
      key: {
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
      link: {
        type: DataTypes.VIRTUAL,
        get() {
          return generateS3link(this.key);
        },
      },
    },
    {
      sequelize,
      modelName: 'File',
    },
  );
  return File;
};
