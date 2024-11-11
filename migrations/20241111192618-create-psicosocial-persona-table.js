// migrations/YYYYMMDDHHMMSS-create-psicosocial-persona-table.js
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('psicosocial_persona', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ustedesRecibieronAyuda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ustedesRecibieronAyudaDeQuien: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ustedesRecibieronAyudaQueTipo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      principalNecesidad: {
        type: DataTypes.STRING,
        allowNull: true
      },
      desplazamiento: {
        type: DataTypes.STRING,
        allowNull: true
      },
      deQueLugar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      deseosVolver: {
        type: DataTypes.STRING,
        allowNull: true
      },
      despuesDesplazamientoRechazoDiscriminacion: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cambiosDespuesDesplazamiento: {
        type: DataTypes.STRING,
        allowNull: true
      },
      afectadosNegativamenteDesplazamiento: {
        type: DataTypes.STRING,
        allowNull: true
      },
      desplazamientoPositivo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      aGustoEnVivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      queLeGustaOMenosGusta: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lugarPreferidoDentroCasa: {
        type: DataTypes.STRING,
        allowNull: true
      },
      consumoAlimentos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      casosMaltratoOViolencia: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ayudaODenuncia: {
        type: DataTypes.STRING,
        allowNull: true
      },
      decisionesImportantesEnFamilia: {
        type: DataTypes.STRING,
        allowNull: true
      },
      correccionDeProblemasEnFamilia: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resolucionProblemasEnComunidad: {
        type: DataTypes.STRING,
        allowNull: true
      },
      necesidadCapacitarse: {
        type: DataTypes.STRING,
        allowNull: true
      },
      enQueOPorqueCapacitarse: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emprenderNegocio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      deQueOPorqueEmprender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      condicionesVidaEnUnAno: {
        type: DataTypes.STRING,
        allowNull: true
      },
      molestiasSalud: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cambiosEnMenores15Anos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dedicacionTiempoLibre: {
        type: DataTypes.STRING,
        allowNull: true
      },
      felicidadActual: {
        type: DataTypes.STRING,
        allowNull: true
      },
      personaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'paciente_id'
      },
      fichaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ficha_id'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('psicosocial_persona');
  }
};
