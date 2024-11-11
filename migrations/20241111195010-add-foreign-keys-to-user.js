'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('user', {
      fields: ['rol_id'],
      type: 'foreign key',
      name: 'fk_user_rol',
      references: {
        table: 'user_roles',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint('user', 'fk_user_rol');
  }
};
