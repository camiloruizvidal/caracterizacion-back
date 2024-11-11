'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('ficha_descripcion', {
      fields: ['ficha_grupo_id'],
      type: 'foreign key',
      name: 'fk_ficha_descripcion_ficha_grupo',
      references: {
        table: 'ficha_grupo',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'ficha_descripcion',
      'fk_ficha_descripcion_ficha_grupo'
    );
  }
};
