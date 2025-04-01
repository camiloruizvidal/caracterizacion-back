'use strict';

module.exports = {
  up: async queryInterface => {
    // Agregar llave foránea a ficha_json.version
    await queryInterface.addConstraint('ficha_json', {
      fields: ['version'],
      type: 'foreign key',
      name: 'fk_ficha_json_version',
      references: {
        table: 'version',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a mapeos_excel.ficha_json_id
    await queryInterface.addConstraint('mapeos_excel', {
      fields: ['ficha_json_id'],
      type: 'foreign key',
      name: 'fk_mapeos_excel_ficha_json',
      references: {
        table: 'ficha_json',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a registros_excel.mapeo_excel_id
    await queryInterface.addConstraint('registros_excel', {
      fields: ['mapeo_excel_id'],
      type: 'foreign key',
      name: 'fk_registros_excel_mapeo_excel',
      references: {
        table: 'mapeos_excel',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a cargas.registro_excel_id
    await queryInterface.addConstraint('cargas', {
      fields: ['registro_excel_id'],
      type: 'foreign key',
      name: 'fk_cargas_registro_excel',
      references: {
        table: 'registros_excel',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a ficha_procesada.ficha_json_id
    await queryInterface.addConstraint('ficha_procesada', {
      fields: ['ficha_json_id'],
      type: 'foreign key',
      name: 'fk_ficha_procesada_ficha_json',
      references: {
        table: 'ficha_json',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a user_codes.user_id
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

    // Agregar llave foránea a user_roles.user_id
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

    // Agregar llave foránea a log.user_id
    await queryInterface.addConstraint('log', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_log_user',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Agregar llave foránea a backup.user_id
    await queryInterface.addConstraint('backup', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_backup_user',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async queryInterface => {
    // Eliminar todas las llaves foráneas en orden inverso
    await queryInterface.removeConstraint('backup', 'fk_backup_user');
    await queryInterface.removeConstraint('log', 'fk_log_user');
    await queryInterface.removeConstraint('user_roles', 'fk_user_roles_user');
    await queryInterface.removeConstraint('user_codes', 'fk_user_codes_user');
    await queryInterface.removeConstraint(
      'ficha_procesada',
      'fk_ficha_procesada_ficha_json'
    );
    await queryInterface.removeConstraint('cargas', 'fk_cargas_registro_excel');
    await queryInterface.removeConstraint(
      'registros_excel',
      'fk_registros_excel_mapeo_excel'
    );
    await queryInterface.removeConstraint(
      'mapeos_excel',
      'fk_mapeos_excel_ficha_json'
    );
    await queryInterface.removeConstraint(
      'ficha_json',
      'fk_ficha_json_version'
    );
  }
};
