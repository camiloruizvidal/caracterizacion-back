'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cargas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ficha_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      url_archivo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('INGRESADO', 'PROCESANDO', 'FINALIZADO', 'ERROR'),
        allowNull: false,
        defaultValue: 'INGRESADO'
      },
      mensaje_error: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cantidad_registros: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('cargas');
  }
};
