'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('persona', 'documento_tipo_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'documento_tipo',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('persona', 'documento_tipo_id');
  }
};
