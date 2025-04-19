'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mapeos_excel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ficha_json_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      columnas_excel: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      mapeo: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('mapeos_excel');
  }
};
