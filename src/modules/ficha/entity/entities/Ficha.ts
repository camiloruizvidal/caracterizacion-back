import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ficha', { schema: 'public' })
export class Ficha {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'marca_temporal', nullable: true })
  marcaTemporal: string | null;

  @Column('character varying', { name: 'codigo', nullable: true })
  codigo: string | null;

  @Column('integer', { name: 'id_encuestador', nullable: true })
  idEncuestador: number | null;

  @Column('timestamp without time zone', { name: 'fecha', nullable: true })
  fecha: Date | null;

  @Column('character varying', { name: 'hora_inicio', nullable: true })
  horaInicio: string | null;

  @Column('character varying', { name: 'hora_culminacion', nullable: true })
  horaCulminacion: string | null;

  @Column('character varying', { name: 'direccion', nullable: true })
  direccion: string | null;

  @Column('integer', { name: 'id_municipio', nullable: true })
  idMunicipio: number | null;

  @Column('character varying', { name: 'barrio', nullable: true })
  barrio: string | null;

  @Column('character varying', { name: 'telefono', nullable: true })
  telefono: string | null;

  @Column('character varying', {
    name: 'pertenencia_organizacion',
    nullable: true
  })
  pertenenciaOrganizacion: string | null;

  @Column('character varying', {
    name: 'personas_viven_en_vivienda',
    nullable: true
  })
  personasVivenEnVivienda: string | null;

  @Column('integer', { name: 'familias_residen_en_vivienda', nullable: true })
  familiasResidenEnVivienda: number | null;

  @Column('character varying', {
    name: 'si_marco_si_organizacion',
    nullable: true
  })
  siMarcoSiOrganizacion: string | null;

  @Column('character varying', { name: 'si_marco_si_ayuda', nullable: true })
  siMarcoSiAyuda: string | null;

  @Column('character varying', { name: 'principal_necesidad', nullable: true })
  principalNecesidad: string | null;

  @Column('character varying', { name: 'desplazamiento', nullable: true })
  desplazamiento: string | null;

  @Column('character varying', { name: 'de_que_lugar', nullable: true })
  deQueLugar: string | null;

  @Column('character varying', { name: 'deseos_volver', nullable: true })
  deseosVolver: string | null;

  @Column('character varying', {
    name: 'despues_desplazamiento_rechazo_discriminacion',
    nullable: true
  })
  despuesDesplazamientoRechazoDiscriminacion: string | null;

  @Column('character varying', {
    name: 'cambios_despues_desplazamiento',
    nullable: true
  })
  cambiosDespuesDesplazamiento: string | null;

  @Column('character varying', {
    name: 'afectados_negativamente_desplazamiento',
    nullable: true
  })
  afectadosNegativamenteDesplazamiento: string | null;

  @Column('character varying', {
    name: 'desplazamiento_positivo',
    nullable: true
  })
  desplazamientoPositivo: string | null;

  @Column('character varying', { name: 'a_gusto_en_vivienda', nullable: true })
  aGustoEnVivienda: string | null;

  @Column('character varying', {
    name: 'que_le_gusta_o_menos_gusta',
    nullable: true
  })
  queLeGustaOMenosGusta: string | null;

  @Column('character varying', {
    name: 'lugar_preferido_dentro_casa',
    nullable: true
  })
  lugarPreferidoDentroCasa: string | null;

  @Column('character varying', { name: 'consumo_alimentos', nullable: true })
  consumoAlimentos: string | null;

  @Column('character varying', {
    name: 'casos_maltrato_o_violencia',
    nullable: true
  })
  casosMaltratoOViolencia: string | null;

  @Column('character varying', { name: 'ayuda_o_denuncia', nullable: true })
  ayudaODenuncia: string | null;

  @Column('character varying', {
    name: 'decisiones_importantes_en_familia',
    nullable: true
  })
  decisionesImportantesEnFamilia: string | null;

  @Column('character varying', {
    name: 'correccion_de_problemas_en_familia',
    nullable: true
  })
  correccionDeProblemasEnFamilia: string | null;

  @Column('character varying', {
    name: 'resolucion_problemas_en_comunidad',
    nullable: true
  })
  resolucionProblemasEnComunidad: string | null;

  @Column('character varying', {
    name: 'necesidad_capacitarse',
    nullable: true
  })
  necesidadCapacitarse: string | null;

  @Column('character varying', {
    name: 'en_que_o_porque_capacitarse',
    nullable: true
  })
  enQueOPorqueCapacitarse: string | null;

  @Column('character varying', { name: 'emprender_negocio', nullable: true })
  emprenderNegocio: string | null;

  @Column('character varying', {
    name: 'de_que_o_porque_emprender',
    nullable: true
  })
  deQueOPorqueEmprender: string | null;

  @Column('character varying', {
    name: 'condiciones_vida_en_un_ano',
    nullable: true
  })
  condicionesVidaEnUnAno: string | null;

  @Column('character varying', { name: 'molestias_salud', nullable: true })
  molestiasSalud: string | null;

  @Column('character varying', {
    name: 'cambios_en_menores_15_anos',
    nullable: true
  })
  cambiosEnMenores_15Anos: string | null;

  @Column('character varying', {
    name: 'dedicacion_tiempo_libre',
    nullable: true
  })
  dedicacionTiempoLibre: string | null;

  @Column('character varying', { name: 'felicidad_actual', nullable: true })
  felicidadActual: string | null;

  @Column('character varying', { name: 'tipo_vivienda', nullable: true })
  tipoVivienda: string | null;

  @Column('character varying', { name: 'valor_arriendo', nullable: true })
  valorArriendo: string | null;

  @Column('character varying', { name: 'lote_legalizado', nullable: true })
  loteLegalizado: string | null;

  @Column('character varying', { name: 'estrato_vivienda', nullable: true })
  estratoVivienda: string | null;

  @Column('character varying', { name: 'trabajo_en_casa', nullable: true })
  trabajoEnCasa: string | null;

  @Column('integer', { name: 'ingresos_mensuales_familia', nullable: true })
  ingresosMensualesFamilia: number | null;

  @Column('integer', { name: 'gastos_servicios_publicos', nullable: true })
  gastosServiciosPublicos: number | null;

  @Column('character varying', {
    name: 'acceso_facil_vivienda',
    nullable: true
  })
  accesoFacilVivienda: string | null;

  @Column('character varying', {
    name: 'desplazamiento_escuela_centro_estudio',
    nullable: true
  })
  desplazamientoEscuelaCentroEstudio: string | null;

  @Column('character varying', {
    name: 'tiempo_promedio_desplazamiento_escuela',
    nullable: true
  })
  tiempoPromedioDesplazamientoEscuela: string | null;

  @Column('character varying', {
    name: 'desplazamiento_trabajo',
    nullable: true
  })
  desplazamientoTrabajo: string | null;

  @Column('character varying', {
    name: 'tiempo_promedio_desplazamiento_trabajo',
    nullable: true
  })
  tiempoPromedioDesplazamientoTrabajo: string | null;

  @Column('character varying', { name: 'desplazamiento_salud', nullable: true })
  desplazamientoSalud: string | null;

  @Column('character varying', {
    name: 'tiempo_promedio_desplazamiento_salud',
    nullable: true
  })
  tiempoPromedioDesplazamientoSalud: string | null;

  @Column('character varying', {
    name: 'cocina_sitio_preparar_alimentos',
    nullable: true
  })
  cocinaSitioPrepararAlimentos: string | null;

  @Column('character varying', { name: 'combustible_cocinar', nullable: true })
  combustibleCocinar: string | null;

  @Column('character varying', {
    name: 'servicios_basicos_vivienda',
    nullable: true
  })
  serviciosBasicosVivienda: string | null;

  @Column('character varying', {
    name: 'conformidad_servicios',
    nullable: true
  })
  conformidadServicios: string | null;

  @Column('character varying', {
    name: 'por_que_no_conformidad',
    nullable: true
  })
  porQueNoConformidad: string | null;

  @Column('character varying', { name: 'origen_agua_consumo', nullable: true })
  origenAguaConsumo: string | null;

  @Column('character varying', {
    name: 'regularidad_obtencion_agua',
    nullable: true
  })
  regularidadObtencionAgua: string | null;

  @Column('character varying', { name: 'almacenamiento_agua', nullable: true })
  almacenamientoAgua: string | null;

  @Column('character varying', {
    name: 'frecuencia_lavado_tanque_recipiente',
    nullable: true
  })
  frecuenciaLavadoTanqueRecipiente: string | null;

  @Column('character varying', {
    name: 'ubicacion_tanque_recipiente',
    nullable: true
  })
  ubicacionTanqueRecipiente: string | null;

  @Column('character varying', { name: 'tratamiento_agua', nullable: true })
  tratamientoAgua: string | null;

  @Column('character varying', { name: 'tiempo_hervir_agua', nullable: true })
  tiempoHervirAgua: string | null;

  @Column('character varying', { name: 'servicio_sanitario', nullable: true })
  servicioSanitario: string | null;

  @Column('character varying', {
    name: 'disposicion_final_basuras',
    nullable: true
  })
  disposicionFinalBasuras: string | null;

  @Column('character varying', {
    name: 'separacion_residuos_reciclaje',
    nullable: true
  })
  separacionResiduosReciclaje: string | null;

  @Column('character varying', {
    name: 'proteccion_contra_animales_plagas_vectores',
    nullable: true
  })
  proteccionContraAnimalesPlagasVectores: string | null;

  @Column('character varying', {
    name: 'guardado_ropa_vivienda',
    nullable: true
  })
  guardadoRopaVivienda: string | null;

  @Column('character varying', {
    name: 'guardado_individual_ropa',
    nullable: true
  })
  guardadoIndividualRopa: string | null;

  @Column('character varying', { name: 'aseo_en_vivienda', nullable: true })
  aseoEnVivienda: string | null;

  @Column('character varying', {
    name: 'uso_detergentes_desinfectantes_aseo',
    nullable: true
  })
  usoDetergentesDesinfectantesAseo: string | null;

  @Column('character varying', {
    name: 'uso_final_plaguicidas',
    nullable: true
  })
  usoFinalPlaguicidas: string | null;

  @Column('character varying', {
    name: 'lavar_verduras_frutas_crudas',
    nullable: true
  })
  lavarVerdurasFrutasCrudas: string | null;

  @Column('character varying', {
    name: 'encender_velas_velones',
    nullable: true
  })
  encenderVelasVelones: string | null;

  @Column('character varying', {
    name: 'frecuencia_humo_en_vivienda',
    nullable: true
  })
  frecuenciaHumoEnVivienda: string | null;

  @Column('character varying', {
    name: 'accidente_lesion_ultimo_anio',
    nullable: true
  })
  accidenteLesionUltimoAnio: string | null;

  @Column('character varying', {
    name: 'tipo_lesion_accidente',
    nullable: true
  })
  tipoLesionAccidente: string | null;

  @Column('character varying', { name: 'secuelas_accidentes', nullable: true })
  secuelasAccidentes: string | null;

  @Column('character varying', {
    name: 'accidentes_frecuentes_en_ninos',
    nullable: true
  })
  accidentesFrecuentesEnNinos: string | null;

  @Column('character varying', {
    name: 'hay_ninos_menores_5_anos',
    nullable: true
  })
  hayNinosMenores_5Anos: string | null;

  @Column('character varying', {
    name: 'busqueda_ayuda_enfermedad_ninos',
    nullable: true
  })
  busquedaAyudaEnfermedadNinos: string | null;

  @Column('character varying', {
    name: 'edad_promedio_lactancia_materna',
    nullable: true
  })
  edadPromedioLactanciaMaterna: string | null;

  @Column('character varying', {
    name: 'esquema_vacunacion_completo_ninos',
    nullable: true
  })
  esquemaVacunacionCompletoNinos: string | null;

  @Column('character varying', {
    name: 'purgado_ninos_ultimo_anio',
    nullable: true
  })
  purgadoNinosUltimoAnio: string | null;

  @Column('character varying', {
    name: 'enfermedades_ultimo_mes',
    nullable: true
  })
  enfermedadesUltimoMes: string | null;

  @Column('character varying', {
    name: 'enfermedades_ultimo_mes_diarrea',
    nullable: true
  })
  enfermedadesUltimoMesDiarrea: string | null;

  @Column('character varying', {
    name: 'enfermedades_ultimo_mes_resfriado',
    nullable: true
  })
  enfermedadesUltimoMesResfriado: string | null;

  @Column('character varying', {
    name: 'enfermedades_ultimo_mes_piel_alergias',
    nullable: true
  })
  enfermedadesUltimoMesPielAlergias: string | null;

  @Column('character varying', {
    name: 'otra_enfermedad_ultimo_mes',
    nullable: true
  })
  otraEnfermedadUltimoMes: string | null;

  @Column('character varying', {
    name: 'ayuda_enfermedad_ultimo_mes_diarrea',
    nullable: true
  })
  ayudaEnfermedadUltimoMesDiarrea: string | null;

  @Column('character varying', {
    name: 'ayuda_enfermedad_ultimo_mes_resfriado',
    nullable: true
  })
  ayudaEnfermedadUltimoMesResfriado: string | null;

  @Column('character varying', {
    name: 'ayuda_enfermedad_ultimo_mes_piel_alergias',
    nullable: true
  })
  ayudaEnfermedadUltimoMesPielAlergias: string | null;

  @Column('character varying', {
    name: 'otra_enfermedad_ultimo_mes_ayuda',
    nullable: true
  })
  otraEnfermedadUltimoMesAyuda: string | null;

  @Column('character varying', {
    name: 'sufrimiento_enfermedades',
    nullable: true
  })
  sufrimientoEnfermedades: string | null;

  @Column('character varying', {
    name: 'enfermedades_miembros_familia',
    nullable: true
  })
  enfermedadesMiembrosFamilia: string | null;

  @Column('character varying', { name: 'embarazo_en_familia', nullable: true })
  embarazoEnFamilia: string | null;

  @Column('character varying', {
    name: 'control_embarazo_en_familia',
    nullable: true
  })
  controlEmbarazoEnFamilia: string | null;

  @Column('character varying', {
    name: 'razon_no_control_embarazo',
    nullable: true
  })
  razonNoControlEmbarazo: string | null;

  @Column('character varying', {
    name: 'frecuencia_visitas_odontologo',
    nullable: true
  })
  frecuenciaVisitasOdontologo: string | null;

  @Column('character varying', {
    name: 'muerte_familiares_ultimo_cinco_anos_violenta_accidente',
    nullable: true
  })
  muerteFamiliaresUltimoCincoAnosViolentaAccidente: string | null;

  @Column('character varying', {
    name: 'muerte_familiares_ultimo_cinco_anos_enfermedad_cronica',
    nullable: true
  })
  muerteFamiliaresUltimoCincoAnosEnfermedadCronica: string | null;

  @Column('character varying', {
    name: 'muerte_familiares_ultimo_cinco_anos_enfermedad_infecciosa',
    nullable: true
  })
  muerteFamiliaresUltimoCincoAnosEnfermedadInfecciosa: string | null;

  @Column('character varying', {
    name: 'tipo_vivienda_repetido',
    nullable: true
  })
  tipoViviendaRepetido: string | null;

  @Column('character varying', {
    name: 'autoconstruccion_vivienda',
    nullable: true
  })
  autoconstruccionVivienda: string | null;

  @Column('character varying', { name: 'topografia_terreno', nullable: true })
  topografiaTerreno: string | null;

  @Column('character varying', { name: 'cerca_vivienda', nullable: true })
  cercaVivienda: string | null;

  @Column('character varying', {
    name: 'cerca_zonas_recreativas',
    nullable: true
  })
  cercaZonasRecreativas: string | null;

  @Column('character varying', { name: 'material_piso', nullable: true })
  materialPiso: string | null;

  @Column('character varying', { name: 'material_paredes', nullable: true })
  materialParedes: string | null;

  @Column('character varying', { name: 'material_techo', nullable: true })
  materialTecho: string | null;

  @Column('character varying', { name: 'ambientes_separados', nullable: true })
  ambientesSeparados: string | null;

  @Column('character varying', { name: 'cuartos_dormitorio', nullable: true })
  cuartosDormitorio: string | null;

  @Column('character varying', {
    name: 'lugar_dormir_personas',
    nullable: true
  })
  lugarDormirPersonas: string | null;

  @Column('character varying', { name: 'cantidad_camas', nullable: true })
  cantidadCamas: string | null;

  @Column('character varying', {
    name: 'ventilacion_natural_cocina',
    nullable: true
  })
  ventilacionNaturalCocina: string | null;

  @Column('character varying', {
    name: 'elementos_separados_casa',
    nullable: true
  })
  elementosSeparadosCasa: string | null;

  @Column('character varying', { name: 'tipo_alumbrado', nullable: true })
  tipoAlumbrado: string | null;

  @Column('character varying', {
    name: 'elementos_pertenencias',
    nullable: true
  })
  elementosPertenencias: string | null;

  @Column('character varying', { name: 'disposicion_excretas', nullable: true })
  disposicionExcretas: string | null;

  @Column('character varying', {
    name: 'sanitario_letrina_distancia_cercana',
    nullable: true
  })
  sanitarioLetrinaDistanciaCercana: string | null;

  @Column('character varying', {
    name: 'cantidad_inodoros_sanitarios',
    nullable: true
  })
  cantidadInodorosSanitarios: string | null;

  @Column('character varying', { name: 'ubicacion_sanitario', nullable: true })
  ubicacionSanitario: string | null;

  @Column('character varying', {
    name: 'lavamanos_cerca_sanitario',
    nullable: true
  })
  lavamanosCercaSanitario: string | null;

  @Column('character varying', { name: 'recogida_basura', nullable: true })
  recogidaBasura: string | null;

  @Column('character varying', {
    name: 'convivencia_animales_vivienda',
    nullable: true
  })
  convivenciaAnimalesVivienda: string | null;

  @Column('character varying', {
    name: 'lugar_preparacion_alimentos',
    nullable: true
  })
  lugarPreparacionAlimentos: string | null;

  @Column('character varying', {
    name: 'material_mesa_alimentos',
    nullable: true
  })
  materialMesaAlimentos: string | null;

  @Column('character varying', {
    name: 'almacenamiento_alimentos',
    nullable: true
  })
  almacenamientoAlimentos: string | null;

  @Column('character varying', {
    name: 'almacenamiento_conjunto_productos',
    nullable: true
  })
  almacenamientoConjuntoProductos: string | null;

  @Column('character varying', {
    name: 'nombre_completo_persona',
    nullable: true
  })
  nombreCompletoPersona: string | null;

  @Column('character varying', {
    name: 'direccion_finca_vivienda',
    nullable: true
  })
  direccionFincaVivienda: string | null;

  @Column('character varying', {
    name: 'barrio_vereda_finca_vivienda',
    nullable: true
  })
  barrioVeredaFincaVivienda: string | null;

  @Column('character varying', {
    name: 'descripcion_caracteristicas_vivienda',
    nullable: true
  })
  descripcionCaracteristicasVivienda: string | null;
}
