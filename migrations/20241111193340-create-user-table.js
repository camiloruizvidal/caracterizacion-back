// migrations/YYYYMMDDHHMMSS-create-user-table.js
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('user', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nombre_primero: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nombre_segundo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      apellido_primero: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apellido_segundo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      documento: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      documento_tipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inactivo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('user');
  }
};
