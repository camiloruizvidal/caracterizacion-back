import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ficha' })
export class FichaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  marca_temporal: string;

  @Column({ nullable: true })
  codigo: string;

  @Column({ nullable: true })
  id_encuestador: number;

  @Column({ nullable: true })
  fecha: Date;

  @Column({ nullable: true })
  hora_inicio: string;

  @Column({ nullable: true })
  hora_culminacion: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  id_municipio: number;

  @Column({ nullable: true })
  barrio: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  pertenencia_organizacion: string;

  @Column({ nullable: true })
  personas_viven_en_vivienda: string;

  @Column({ nullable: true })
  familias_residen_en_vivienda: number;

  @Column({ nullable: true })
  si_marco_si_organizacion: string;

  @Column({ nullable: true })
  si_marco_si_ayuda: string;

  @Column({ nullable: true })
  principal_necesidad: string;

  @Column({ nullable: true })
  desplazamiento: string;

  @Column({ nullable: true })
  de_que_lugar: string;

  @Column({ nullable: true })
  deseos_volver: string;

  @Column({ nullable: true })
  despues_desplazamiento_rechazo_discriminacion: string;

  @Column({ nullable: true })
  cambios_despues_desplazamiento: string;

  @Column({ nullable: true })
  afectados_negativamente_desplazamiento: string;

  @Column({ nullable: true })
  desplazamiento_positivo: string;

  @Column({ nullable: true })
  a_gusto_en_vivienda: string;

  @Column({ nullable: true })
  que_le_gusta_o_menos_gusta: string;

  @Column({ nullable: true })
  lugar_preferido_dentro_casa: string;

  @Column({ nullable: true })
  consumo_alimentos: string;

  @Column({ nullable: true })
  casos_maltrato_o_violencia: string;

  @Column({ nullable: true })
  ayuda_o_denuncia: string;

  @Column({ nullable: true })
  decisiones_importantes_en_familia: string;

  @Column({ nullable: true })
  correccion_de_problemas_en_familia: string;

  @Column({ nullable: true })
  resolucion_problemas_en_comunidad: string;

  @Column({ nullable: true })
  necesidad_capacitarse: string;

  @Column({ nullable: true })
  en_que_o_porque_capacitarse: string;

  @Column({ nullable: true })
  emprender_negocio: string;

  @Column({ nullable: true })
  de_que_o_porque_emprender: string;

  @Column({ nullable: true })
  condiciones_vida_en_un_ano: string;

  @Column({ nullable: true })
  molestias_salud: string;

  @Column({ nullable: true })
  cambios_en_menores_15_anos: string;

  @Column({ nullable: true })
  dedicacion_tiempo_libre: string;

  @Column({ nullable: true })
  felicidad_actual: string;

  @Column({ nullable: true })
  tipo_vivienda: string;

  @Column({ nullable: true })
  valor_arriendo: string;

  @Column({ nullable: true })
  lote_legalizado: string;

  @Column({ nullable: true })
  estrato_vivienda: string;

  @Column({ nullable: true })
  trabajo_en_casa: string;

  @Column({ nullable: true })
  ingresos_mensuales_familia: number;

  @Column({ nullable: true })
  gastos_servicios_publicos: number;

  @Column({ nullable: true })
  acceso_facil_vivienda: string;

  @Column({ nullable: true })
  desplazamiento_escuela_centro_estudio: string;

  @Column({ nullable: true })
  tiempo_promedio_desplazamiento_escuela: string;

  @Column({ nullable: true })
  desplazamiento_trabajo: string;

  @Column({ nullable: true })
  tiempo_promedio_desplazamiento_trabajo: string;

  @Column({ nullable: true })
  desplazamiento_salud: string;

  @Column({ nullable: true })
  tiempo_promedio_desplazamiento_salud: string;

  @Column({ nullable: true })
  cocina_sitio_preparar_alimentos: string;

  @Column({ nullable: true })
  combustible_cocinar: string;

  @Column({ nullable: true })
  servicios_basicos_vivienda: string;

  @Column({ nullable: true })
  conformidad_servicios: string;

  @Column({ nullable: true })
  por_que_no_conformidad: string;

  @Column({ nullable: true })
  origen_agua_consumo: string;

  @Column({ nullable: true })
  regularidad_obtencion_agua: string;

  @Column({ nullable: true })
  almacenamiento_agua: string;

  @Column({ nullable: true })
  frecuencia_lavado_tanque_recipiente: string;

  @Column({ nullable: true })
  ubicacion_tanque_recipiente: string;

  @Column({ nullable: true })
  tratamiento_agua: string;

  @Column({ nullable: true })
  tiempo_hervir_agua: string;

  @Column({ nullable: true })
  servicio_sanitario: string;

  @Column({ nullable: true })
  disposicion_final_basuras: string;

  @Column({ nullable: true })
  separacion_residuos_reciclaje: string;

  @Column({ nullable: true })
  proteccion_contra_animales_plagas_vectores: string;

  @Column({ nullable: true })
  guardado_ropa_vivienda: string;

  @Column({ nullable: true })
  guardado_individual_ropa: string;

  @Column({ nullable: true })
  aseo_en_vivienda: string;

  @Column({ nullable: true })
  uso_detergentes_desinfectantes_aseo: string;

  @Column({ nullable: true })
  uso_final_plaguicidas: string;

  @Column({ nullable: true })
  lavar_verduras_frutas_crudas: string;

  @Column({ nullable: true })
  encender_velas_velones: string;

  @Column({ nullable: true })
  frecuencia_humo_en_vivienda: string;

  @Column({ nullable: true })
  accidente_lesion_ultimo_anio: string;

  @Column({ nullable: true })
  tipo_lesion_accidente: string;

  @Column({ nullable: true })
  secuelas_accidentes: string;

  @Column({ nullable: true })
  accidentes_frecuentes_en_ninos: string;

  @Column({ nullable: true })
  hay_ninos_menores_5_anos: string;

  @Column({ nullable: true })
  busqueda_ayuda_enfermedad_ninos: string;

  @Column({ nullable: true })
  edad_promedio_lactancia_materna: string;

  @Column({ nullable: true })
  esquema_vacunacion_completo_ninos: string;

  @Column({ nullable: true })
  purgado_ninos_ultimo_anio: string;

  @Column({ nullable: true })
  enfermedades_ultimo_mes: string;

  @Column({ nullable: true })
  enfermedades_ultimo_mes_diarrea: string;

  @Column({ nullable: true })
  enfermedades_ultimo_mes_resfriado: string;

  @Column({ nullable: true })
  enfermedades_ultimo_mes_piel_alergias: string;

  @Column({ nullable: true })
  otra_enfermedad_ultimo_mes: string;

  @Column({ nullable: true })
  ayuda_enfermedad_ultimo_mes_diarrea: string;

  @Column({ nullable: true })
  ayuda_enfermedad_ultimo_mes_resfriado: string;

  @Column({ nullable: true })
  ayuda_enfermedad_ultimo_mes_piel_alergias: string;

  @Column({ nullable: true })
  otra_enfermedad_ultimo_mes_ayuda: string;

  @Column({ nullable: true })
  sufrimiento_enfermedades: string;

  @Column({ nullable: true })
  enfermedades_miembros_familia: string;

  @Column({ nullable: true })
  embarazo_en_familia: string;

  @Column({ nullable: true })
  control_embarazo_en_familia: string;

  @Column({ nullable: true })
  razon_no_control_embarazo: string;

  @Column({ nullable: true })
  frecuencia_visitas_odontologo: string;

  @Column({ nullable: true })
  muerte_familiares_ultimo_cinco_anos_violenta_accidente: string;

  @Column({ nullable: true })
  muerte_familiares_ultimo_cinco_anos_enfermedad_cronica: string;

  @Column({ nullable: true })
  muerte_familiares_ultimo_cinco_anos_enfermedad_infecciosa: string;

  @Column({ nullable: true })
  tipo_vivienda_repetido: string;

  @Column({ nullable: true })
  autoconstruccion_vivienda: string;

  @Column({ nullable: true })
  topografia_terreno: string;

  @Column({ nullable: true })
  cerca_vivienda: string;

  @Column({ nullable: true })
  cerca_zonas_recreativas: string;

  @Column({ nullable: true })
  material_piso: string;

  @Column({ nullable: true })
  material_paredes: string;

  @Column({ nullable: true })
  material_techo: string;

  @Column({ nullable: true })
  ambientes_separados: string;

  @Column({ nullable: true })
  cuartos_dormitorio: string;

  @Column({ nullable: true })
  lugar_dormir_personas: string;

  @Column({ nullable: true })
  cantidad_camas: string;

  @Column({ nullable: true })
  ventilacion_natural_cocina: string;

  @Column({ nullable: true })
  elementos_separados_casa: string;

  @Column({ nullable: true })
  tipo_alumbrado: string;

  @Column({ nullable: true })
  elementos_pertenencias: string;

  @Column({ nullable: true })
  disposicion_excretas: string;

  @Column({ nullable: true })
  sanitario_letrina_distancia_cercana: string;

  @Column({ nullable: true })
  cantidad_inodoros_sanitarios: string;

  @Column({ nullable: true })
  ubicacion_sanitario: string;

  @Column({ nullable: true })
  lavamanos_cerca_sanitario: string;

  @Column({ nullable: true })
  recogida_basura: string;

  @Column({ nullable: true })
  convivencia_animales_vivienda: string;

  @Column({ nullable: true })
  lugar_preparacion_alimentos: string;

  @Column({ nullable: true })
  material_mesa_alimentos: string;

  @Column({ nullable: true })
  almacenamiento_alimentos: string;

  @Column({ nullable: true })
  almacenamiento_conjunto_productos: string;

  @Column({ nullable: true })
  nombre_completo_persona: string;

  @Column({ nullable: true })
  direccion_finca_vivienda: string;

  @Column({ nullable: true })
  barrio_vereda_finca_vivienda: string;

  @Column({ nullable: true })
  descripcion_caracteristicas_vivienda: string;
}
