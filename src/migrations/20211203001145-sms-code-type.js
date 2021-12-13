'use strict';
const { TYPES } = require('../modules/sms/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SmsCodes', 'type', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: TYPES.RESTORE_PASSWORD.VALUE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SmsCodes', 'type');
  },
};
