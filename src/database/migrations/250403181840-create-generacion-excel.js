'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('generacion_excel', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ruta_archivo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('EN_PROCESO', 'COMPLETADO', 'ERROR'),
        allowNull: false,
        defaultValue: 'EN_PROCESO'
      },
      total_registros: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      registros_procesados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      mensaje_error: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('generacion_excel');
  }
};
