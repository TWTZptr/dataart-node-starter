'use strict';
const { Model } = require('sequelize');
const { TYPES } = require('../modules/sms/constants');

module.exports = (sequelize, DataTypes) => {
  class SmsCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SmsCode.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.TINYINT.UNSIGNED,
      },
      code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        field: 'user_id',
      },
      type: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        get() {
          const typeValue = this.getDataValue('type');
          switch (typeValue) {
            case TYPES.RESTORE_PASSWORD.VALUE:
              return TYPES.RESTORE_PASSWORD.NAME;
          }
        },
        set(value) {
          switch (value) {
            case TYPES.RESTORE_PASSWORD.NAME:
              this.setDataValue('type', TYPES.RESTORE_PASSWORD.VALUE);
              break;
          }
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'SmsCodes',
    },
  );
  return SmsCode;
};
