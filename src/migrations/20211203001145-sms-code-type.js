'use strict';
const { CODE_TYPE_RESTORE_PASSWORD } = require('../modules/sms/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SmsCodes', 'type', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: CODE_TYPE_RESTORE_PASSWORD,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SmsCodes', 'type');
  },
};
