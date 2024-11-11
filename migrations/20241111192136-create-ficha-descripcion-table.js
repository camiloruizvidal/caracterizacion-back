'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('ficha_descripcion', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_columna: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM(
          'address',
          'calendar',
          'photo',
          'check',
          'email',
          'filter',
          'gps',
          'numbers',
          'phone',
          'relationship',
          'select',
          'selectFilter',
          'text',
          'textarea',
          'title',
          'subtitle',
          'ruta_atencion',
          'select_multiple'
        ),
        defaultValue: 'text'
      },
      options: {
        type: DataTypes.STRING,
        allowNull: true
      },
      default: {
        type: DataTypes.STRING,
        allowNull: true
      },
      visibility: {
        type: DataTypes.STRING,
        allowNull: true
      },
      required: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ficha_grupo_id: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('ficha_descripcion');
  }
};
