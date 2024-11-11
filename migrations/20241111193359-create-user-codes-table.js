'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('user_codes', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      start: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      finish: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('user_codes');
  }
};
