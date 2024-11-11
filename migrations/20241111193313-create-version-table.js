'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('version', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date_last_version: {
        type: DataTypes.DATE,
        allowNull: true
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
    await queryInterface.dropTable('version');
  }
};
