'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('ficha_json', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      isFinish: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateLastVersion: {
        type: DataTypes.DATE,
        allowNull: false
      },
      grupalNombre: {
        type: DataTypes.JSON,
        allowNull: false
      },
      individualNombre: {
        type: DataTypes.JSON,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ficha_json');
  }
};
