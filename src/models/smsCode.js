'use strict';
const { Model } = require('sequelize');
const smsTypes = require('../modules/sms/constants');

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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        get() {
          const typeValue = this.getDataValue('type');
          switch (typeValue) {
            case smsTypes.RESTORE_PASSWORD:
              return 'RESTORE_PASSWORD';
          }
        },
        set(value) {
          switch (value) {
            case 'RESTORE_PASSWORD':
              this.setDataValue('type', smsTypes.RESTORE_PASSWORD);
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
