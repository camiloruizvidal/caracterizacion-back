'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('persona', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre_primero: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nombre_segundo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      apellido_primero: {
        type: Sequelize.STRING,
        allowNull: true
      },
      apellido_segundo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      documento: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sexo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      parentesco: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ocupacion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aporta_ingresos: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nivel_escolaridad: {
        type: Sequelize.STRING,
        allowNull: true
      },
      afilicion_salud_tipo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      grupo_atencion_especial: {
        type: Sequelize.STRING,
        allowNull: true
      },
      discapacidad: {
        type: Sequelize.STRING,
        allowNull: true
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('persona');
  }
};
