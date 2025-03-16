'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      date_last_version: {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ficha_json');
  }
};
