'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('ficha_grupo', {
      fields: ['ficha_tipo_id'],
      type: 'foreign key',
      name: 'fk_ficha_grupo_ficha_tipo',
      references: {
        table: 'ficha_tipo',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'ficha_grupo',
      'fk_ficha_grupo_ficha_tipo'
    );
  }
};
