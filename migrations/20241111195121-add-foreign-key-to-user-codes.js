'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.addConstraint('user_codes', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_codes_user',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeConstraint('user_codes', 'fk_user_codes_user');
  }
};
