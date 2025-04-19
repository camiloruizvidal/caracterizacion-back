'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ficha_procesada', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_creacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      date_last_version: {
        type: Sequelize.DATE,
        allowNull: false
      },
      date_register: {
        type: Sequelize.DATE,
        allowNull: false
      },
      codigo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      grupal_data: {
        type: Sequelize.JSON,
        allowNull: true
      },
      individual_data: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ficha_procesada');
  }
};
