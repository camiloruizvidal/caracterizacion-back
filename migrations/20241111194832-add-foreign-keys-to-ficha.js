'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('ficha', {
      fields: ['usuario_creacion_id'],
      type: 'foreign key',
      name: 'fk_ficha_usuario_creacion',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint('ficha', 'fk_ficha_usuario_creacion');
  }
};
