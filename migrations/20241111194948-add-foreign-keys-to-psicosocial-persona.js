'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('psicosocial_persona', {
      fields: ['ficha_id'],
      type: 'foreign key',
      name: 'fk_psicosocial_persona_ficha',
      references: {
        table: 'ficha',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('psicosocial_persona', {
      fields: ['paciente_id'],
      type: 'foreign key',
      name: 'fk_psicosocial_persona_paciente',
      references: {
        table: 'pacientes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint(
      'psicosocial_persona',
      'fk_psicosocial_persona_ficha'
    );
    await queryInterface.removeConstraint(
      'psicosocial_persona',
      'fk_psicosocial_persona_paciente'
    );
  }
};
