'use strict';

module.exports = {
  up: async queryInterface => {
    const version = await queryInterface.bulkInsert(
      'version',
      [
        {
          nombre: 'Versión 1.0',
          descripcion: 'Versión inicial del formulario de caracterización',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true }
    );

    await queryInterface.bulkInsert('ficha_json', [
      {
        version: version[0].id,
        nombre: 'Formulario para caracterización - Equipos Básicos de Salud',
        descripcion: 'Tarjeta personal',
        estructura: JSON.stringify([
          {
            id: 38,
            orden: 1,
            title: '3.1. Identificación de cada uno de los integrantes',
            values: [
              {
                type: 'text',
                label: '51. Primer Nombre'
              }
            ]
          }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete(
      'ficha_json',
      { nombre: 'Formulario para caracterización - Equipos Básicos de Salud' },
      {}
    );
    await queryInterface.bulkDelete('version', { nombre: 'Versión 1.0' }, {});
  }
};
