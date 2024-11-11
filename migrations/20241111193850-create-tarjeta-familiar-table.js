'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('tarjeta_familiar', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      barrio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      municipio: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: true
      },
      participa_organizacion_comunitaria: {
        type: DataTypes.STRING,
        allowNull: true
      },
      participa_organizacion_comunitaria_si: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cuantas_personas_residen_en_la_vivienda: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cuantas_familias_residen_en_esta_vivienda: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ubicacion_gps: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipo_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipo_vivienda_valor_arriendo: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      tipo_vivienda_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lote_legalizado: {
        type: DataTypes.STRING,
        allowNull: true
      },
      estrato_vivienda: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      trabajo_en_casa: {
        type: DataTypes.STRING,
        allowNull: true
      },
      trabajo_en_casa_cual: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ingresos_mensuales_familia: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gastos_servicios_publicos: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      acceso_facil_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      desplazamiento_escuela_centro_estudio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tiempo_promedio_desplazamiento_escuela: {
        type: DataTypes.STRING,
        allowNull: true
      },
      desplazamiento_trabajo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tiempo_promedio_desplazamiento_trabajo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      desplazamiento_salud: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tiempo_promedio_desplazamiento_salud: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cocina_sitio_preparar_alimentos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      combustible_cocinar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      servicios_basicos_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      conformidad_servicios: {
        type: DataTypes.STRING,
        allowNull: true
      },
      por_que_no_conformidad: {
        type: DataTypes.STRING,
        allowNull: true
      },
      origen_agua_consumo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      origen_agua_consumo_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      regularidad_obtencion_agua: {
        type: DataTypes.STRING,
        allowNull: true
      },
      almacenamiento_agua: {
        type: DataTypes.STRING,
        allowNull: true
      },
      frecuencia_lavado_tanque_recipiente: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ubicacion_tanque_recipiente: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tratamiento_agua: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tratamiento_agua_tiempo_hervir_agua: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tratamiento_agua_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      servicio_sanitario: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disposicion_final_basuras: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disposicion_final_basuras_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      separacion_residuos_reciclaje: {
        type: DataTypes.STRING,
        allowNull: true
      },
      proteccion_contra_animales_plagas_vectores: {
        type: DataTypes.STRING,
        allowNull: true
      },
      proteccion_contra_animales_plagas_vectores_otros: {
        type: DataTypes.STRING,
        allowNull: true
      },
      guardado_ropa_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      guardado_ropa_vivienda_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      guardado_individual_ropa: {
        type: DataTypes.STRING,
        allowNull: true
      },
      aseo_en_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      aseo_en_vivienda_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      uso_detergentes_desinfectantes_aseo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      uso_final_plaguicidas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      uso_final_plaguicidas_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lavar_verduras_frutas_crudas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      encender_velas_velones: {
        type: DataTypes.STRING,
        allowNull: true
      },
      frecuencia_humo_en_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      accidente_lesion_ultimo_anio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipo_lesion_accidente: {
        type: DataTypes.STRING,
        allowNull: true
      },
      secuelas_accidentes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      accidentes_frecuentes_en_ninos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      hay_ninos_menores_5_anos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      menores_cinco_annos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      morbilidad_agudo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      busqueda_ayuda_enfermedad_ninos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      edad_promedio_lactancia_materna: {
        type: DataTypes.STRING,
        allowNull: true
      },
      esquema_vacunacion_completo_ninos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      esquema_vacunacion_completo_ninos_porque_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      purgado_ninos_ultimo_anio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      purgado_ninos_ultimo_anio_cuantas_veces: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      mayores_cinco_annos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mayores_cinco_annos_morbilidad_aguda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otra_enfermedad_ultimo_mes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sufrimiento_enfermedades: {
        type: DataTypes.STRING,
        allowNull: true
      },
      enfermedades_miembros_familia: {
        type: DataTypes.STRING,
        allowNull: true
      },
      frecuencia_visitas_odontologo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      muerte_familiares_ultimo_cinco_anos_violenta_accidente: {
        type: DataTypes.STRING,
        allowNull: true
      },
      muerte_familiares_ultimo_cinco_anos_violenta_accidente_otro: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipo_vivienda_repetido: {
        type: DataTypes.STRING,
        allowNull: true
      },
      autoconstruccion_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      topografia_terreno: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cerca_vivienda: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cerca_zonas_recreativas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      material_piso: {
        type: DataTypes.STRING,
        allowNull: true
      },
      material_paredes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      material_techo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ambientes_separados: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cuartos_dormitorio: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      observe_donde_duerme_personas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cantidad_camas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ventilacion_natural_cocina: {
        type: DataTypes.STRING,
        allowNull: true
      },
      elementos_separados_casa: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipo_alumbrado: {
        type: DataTypes.STRING,
        allowNull: true
      },
      elementos_pertenencias: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disposicion_excretas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sanitario_letrina_distancia_cercana: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cantidad_inodoros_sanitarios: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ubicacion_sanitario: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lavamanos_cerca_sanitario: {
        type: DataTypes.STRING,
        allowNull: true
      },
      manejo_basura: {
        type: DataTypes.STRING,
        allowNull: true
      },
      recogida_basura: {
        type: DataTypes.STRING,
        allowNull: true
      },
      convivencia_animales: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lugar_preparacion_alimentos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      material_mesa_alimentos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      almacenamiento_alimentos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      almacenamiento_conjunto_productos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      notas: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('tarjeta_familiar');
  }
};
