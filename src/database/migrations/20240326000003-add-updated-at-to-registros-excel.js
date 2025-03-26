'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('registros_excel', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('registros_excel', 'updated_at');
  }
};
