'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('ficha_grupo', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ficha_tipo_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      table: {
        type: DataTypes.STRING,
        allowNull: true
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
    await queryInterface.dropTable('ficha_grupo');
  }
};
