'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar llave foránea a user_roles
    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_roles_user_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a ficha_procesada
    await queryInterface.addConstraint('ficha_procesada', {
      fields: ['usuario_creacion_id'],
      type: 'foreign key',
      name: 'fk_ficha_procesada_usuario_creacion_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a persona
    await queryInterface.addConstraint('persona', {
      fields: ['documento_tipo_id'],
      type: 'foreign key',
      name: 'fk_persona_documento_tipo_id',
      references: {
        table: 'documento_tipo',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a cargas
    await queryInterface.addConstraint('cargas', {
      fields: ['ficha_id'],
      type: 'foreign key',
      name: 'fk_cargas_ficha_id',
      references: {
        table: 'ficha_json',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar llave foránea de cargas
    await queryInterface.removeConstraint('cargas', 'fk_cargas_ficha_id');

    // Eliminar llave foránea de persona
    await queryInterface.removeConstraint(
      'persona',
      'fk_persona_documento_tipo_id'
    );

    // Eliminar llave foránea de ficha_procesada
    await queryInterface.removeConstraint(
      'ficha_procesada',
      'fk_ficha_procesada_usuario_creacion_id'
    );

    // Eliminar llave foránea de user_roles
    await queryInterface.removeConstraint(
      'user_roles',
      'fk_user_roles_user_id'
    );
  }
};
