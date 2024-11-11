'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_roles_user',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint('user_roles', 'fk_user_roles_user');
  }
};
