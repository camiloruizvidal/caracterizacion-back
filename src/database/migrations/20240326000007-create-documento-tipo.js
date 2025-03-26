'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero creamos los enums necesarios
    await queryInterface.sequelize.query(`
      CREATE TYPE "documento_tipo_prefijo_enum" AS ENUM ('CC', 'CE', 'TI', 'RC', 'PA');
      CREATE TYPE "documento_tipo_tipodocumento_enum" AS ENUM ('Cédula de Ciudadanía', 'Cédula de Extranjería', 'Tarjeta de Identidad', 'Registro Civil', 'Pasaporte');
    `);

    // Luego creamos la tabla
    await queryInterface.createTable('documento_tipo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prefijo: {
        type: Sequelize.ENUM('CC', 'CE', 'TI', 'RC', 'PA'),
        allowNull: false
      },
      tipoDocumento: {
        type: Sequelize.ENUM(
          'Cédula de Ciudadanía',
          'Cédula de Extranjería',
          'Tarjeta de Identidad',
          'Registro Civil',
          'Pasaporte'
        ),
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('documento_tipo');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "documento_tipo_prefijo_enum";
      DROP TYPE IF EXISTS "documento_tipo_tipodocumento_enum";
    `);
  }
};
