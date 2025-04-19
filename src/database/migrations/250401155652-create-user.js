'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre_primero: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre_segundo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      apellido_primero: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellido_segundo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      documento: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      documento_tipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      inactivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('user');
  }
};
