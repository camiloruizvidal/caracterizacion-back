'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ficha_json', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      is_finish: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      version: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      dateLastVersion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      nombre_grupal: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      nombre_individual: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      individual_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      grupal_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      alerta_individual: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      alerta_grupal: {
        type: Sequelize.JSONB,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ficha_json');
  }
};
