'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      accion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tabla: {
        type: Sequelize.STRING,
        allowNull: false
      },
      registro_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      datos: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('log');
  }
};
