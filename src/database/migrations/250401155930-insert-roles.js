'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: async queryInterface => {
    // Crear usuario administrador
    const salt = await bcrypt.genSalt(Number(process.env.SALTOS_BCRYPT));
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await queryInterface.bulkInsert(
      'user',
      [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          estado: 'activo',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true }
    );

    // Insertar rol de administrador
    await queryInterface.bulkInsert('user_roles', [
      {
        user_id: adminUser[0].id,
        rol: 'administrador',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async queryInterface => {
    // Eliminar roles y usuarios en orden inverso
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('user', { username: 'admin' }, {});
  }
};
