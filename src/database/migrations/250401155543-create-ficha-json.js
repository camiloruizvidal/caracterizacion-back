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
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dateLastVersion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      nombre_grupal: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nombre_individual: {
        type: Sequelize.STRING,
        allowNull: true
      },
      grupal_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      individual_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      es_publicada: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ficha_json');
  }
};
