'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('ficha_procesada', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      usuario_creacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dateLastVersion: {
        type: DataTypes.DATE,
        allowNull: false
      },
      dateRegister: {
        type: DataTypes.DATE,
        allowNull: false
      },
      codigo: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      familyCard: {
        type: DataTypes.JSON,
        allowNull: false
      },
      personCard: {
        type: DataTypes.JSON,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ficha_procesada');
  }
};
