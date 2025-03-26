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
        type: Sequelize.JSONB,
        allowNull: false
      },
      individual_data: {
        type: Sequelize.JSONB,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ficha_procesada');
  }
};
