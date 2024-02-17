import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { FichaEntity } from './ficha.entity';

@Entity({ name: 'tarjeta_familiar' })
export class TarjetaFamiliarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  direccion: string;

  @Column({ type: 'varchar', nullable: true })
  barrio: string;

  @Column({ type: 'varchar', nullable: false })
  municipio: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  participa_organizacion_comunitaria: string;

  @Column({ type: 'varchar', nullable: true })
  participa_organizacion_comunitaria_si: string;

  @Column({ type: 'integer', nullable: true })
  cuantas_personas_residen_en_la_vivienda: number;

  @Column({ type: 'integer', nullable: true })
  cuantas_familias_residen_en_esta_vivienda: number;

  @Column({ type: 'varchar', nullable: true })
  ubicacion_gps: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_vivienda: string;

  @Column({ type: 'integer', nullable: true })
  tipo_vivienda_valor_arriendo: number;

  @Column({ type: 'varchar', nullable: true })
  tipo_vivienda_otro: string;

  @Column({ type: 'varchar', nullable: true })
  lote_legalizado: string;

  @Column({ type: 'integer', nullable: true })
  estrato_vivienda: number;

  @Column({ type: 'varchar', nullable: true })
  trabajo_en_casa: string;

  @Column({ type: 'varchar', nullable: true })
  trabajo_en_casa_cual: string;

  @Column({ type: 'varchar', nullable: true })
  ingresos_mensuales_familia: string;

  @Column({ type: 'integer', nullable: true })
  gastos_servicios_publicos: number;

  @Column({ type: 'varchar', nullable: true })
  acceso_facil_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  desplazamiento_escuela_centro_estudio: string;

  @Column({ type: 'varchar', nullable: true })
  tiempo_promedio_desplazamiento_escuela: string;

  @Column({ type: 'varchar', nullable: true })
  desplazamiento_trabajo: string;

  @Column({ type: 'varchar', nullable: true })
  tiempo_promedio_desplazamiento_trabajo: string;

  @Column({ type: 'varchar', nullable: true })
  desplazamiento_salud: string;

  @Column({ type: 'varchar', nullable: true })
  tiempo_promedio_desplazamiento_salud: string;

  @Column({ type: 'varchar', nullable: true })
  cocina_sitio_preparar_alimentos: string;

  @Column({ type: 'varchar', nullable: true })
  combustible_cocinar: string;

  @Column({ type: 'varchar', nullable: true })
  servicios_basicos_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  conformidad_servicios: string;

  @Column({ type: 'varchar', nullable: true })
  por_que_no_conformidad: string;

  @Column({ type: 'varchar', nullable: true })
  origen_agua_consumo: string;

  @Column({ type: 'varchar', nullable: true })
  origen_agua_consumo_otro: string;

  @Column({ type: 'varchar', nullable: true })
  regularidad_obtencion_agua: string;

  @Column({ type: 'varchar', nullable: true })
  almacenamiento_agua: string;

  @Column({ type: 'varchar', nullable: true })
  frecuencia_lavado_tanque_recipiente: string;

  @Column({ type: 'varchar', nullable: true })
  ubicacion_tanque_recipiente: string;

  @Column({ type: 'varchar', nullable: true })
  tratamiento_agua: string;

  @Column({ type: 'varchar', nullable: true })
  tratamiento_agua_tiempo_hervir_agua: string;

  @Column({ type: 'varchar', nullable: true })
  tratamiento_agua_otro: string;

  @Column({ type: 'varchar', nullable: true })
  servicio_sanitario: string;

  @Column({ type: 'varchar', nullable: true })
  disposicion_final_basuras: string;

  @Column({ type: 'varchar', nullable: true })
  disposicion_final_basuras_otro: string;

  @Column({ type: 'varchar', nullable: true })
  separacion_residuos_reciclaje: string;

  @Column({ type: 'varchar', nullable: true })
  proteccion_contra_animales_plagas_vectores: string;

  @Column({ type: 'varchar', nullable: true })
  proteccion_contra_animales_plagas_vectores_otros: string;

  @Column({ type: 'varchar', nullable: true })
  guardado_ropa_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  guardado_ropa_vivienda_otro: string;

  @Column({ type: 'varchar', nullable: true })
  guardado_individual_ropa: string;

  @Column({ type: 'varchar', nullable: true })
  aseo_en_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  aseo_en_vivienda_otro: string;

  @Column({ type: 'varchar', nullable: true })
  uso_detergentes_desinfectantes_aseo: string;

  @Column({ type: 'varchar', nullable: true })
  uso_final_plaguicidas: string;

  @Column({ type: 'varchar', nullable: true })
  uso_final_plaguicidas_otro: string;

  @Column({ type: 'varchar', nullable: true })
  lavar_verduras_frutas_crudas: string;

  @Column({ type: 'varchar', nullable: true })
  encender_velas_velones: string;

  @Column({ type: 'varchar', nullable: true })
  frecuencia_humo_en_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  accidente_lesion_ultimo_anio: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_lesion_accidente: string;

  @Column({ type: 'varchar', nullable: true })
  secuelas_accidentes: string;

  @Column({ type: 'varchar', nullable: true })
  accidentes_frecuentes_en_ninos: string;

  @Column({ type: 'varchar', nullable: true })
  hay_ninos_menores_5_anos: string;

  @Column({ type: 'varchar', nullable: true })
  menores_cinco_annos: string;

  @Column({ type: 'varchar', nullable: true })
  morbilidad_agudo: string;

  @Column({ type: 'varchar', nullable: true })
  busqueda_ayuda_enfermedad_ninos: string;

  @Column({ type: 'varchar', nullable: true })
  edad_promedio_lactancia_materna: string;

  @Column({ type: 'varchar', nullable: true })
  esquema_vacunacion_completo_ninos: string;

  @Column({ type: 'varchar', nullable: true })
  esquema_vacunacion_completo_ninos_porque_no: string;

  @Column({ type: 'varchar', nullable: true })
  purgado_ninos_ultimo_anio: string;

  @Column({ type: 'integer', nullable: true })
  purgado_ninos_ultimo_anio_cuantas_veces: number;

  @Column({ type: 'varchar', nullable: true })
  mayores_cinco_annos: string;

  @Column({ type: 'varchar', nullable: true })
  mayores_cinco_annos_morbilidad_aguda: string;

  @Column({ type: 'varchar', nullable: true })
  otra_enfermedad_ultimo_mes: string;

  @Column({ type: 'varchar', nullable: true })
  sufrimiento_enfermedades: string;

  @Column({ type: 'varchar', nullable: true })
  enfermedades_miembros_familia: string;

  @Column({ type: 'varchar', nullable: true })
  frecuencia_visitas_odontologo: string;

  @Column({ type: 'varchar', nullable: true })
  muerte_familiares_ultimo_cinco_anos_violenta_accidente: string;

  @Column({ type: 'varchar', nullable: true })
  muerte_familiares_ultimo_cinco_anos_violenta_accidente_otro: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_vivienda_repetido: string;

  @Column({ type: 'varchar', nullable: true })
  autoconstruccion_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  topografia_terreno: string;

  @Column({ type: 'varchar', nullable: true })
  cerca_vivienda: string;

  @Column({ type: 'varchar', nullable: true })
  cerca_zonas_recreativas: string;

  @Column({ type: 'varchar', nullable: true })
  material_piso: string;

  @Column({ type: 'varchar', nullable: true })
  material_paredes: string;

  @Column({ type: 'varchar', nullable: true })
  material_techo: string;

  @Column({ type: 'varchar', nullable: true })
  ambientes_separados: string;

  @Column({ type: 'integer', nullable: true })
  cuartos_dormitorio: number;

  @Column({ type: 'varchar', nullable: true })
  observe_donde_duerme_personas: string;

  @Column({ type: 'varchar', nullable: true })
  cantidad_camas: string;

  @Column({ type: 'varchar', nullable: true })
  ventilacion_natural_cocina: string;

  @Column({ type: 'varchar', nullable: true })
  elementos_separados_casa: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_alumbrado: string;

  @Column({ type: 'varchar', nullable: true })
  elementos_pertenencias: string;

  @Column({ type: 'varchar', nullable: true })
  disposicion_excretas: string;

  @Column({ type: 'varchar', nullable: true })
  sanitario_letrina_distancia_cercana: string;

  @Column({ type: 'varchar', nullable: true })
  cantidad_inodoros_sanitarios: string;

  @Column({ type: 'varchar', nullable: true })
  ubicacion_sanitario: string;

  @Column({ type: 'varchar', nullable: true })
  lavamanos_cerca_sanitario: string;

  @Column({ type: 'varchar', nullable: true })
  manejo_basura: string;

  @Column({ type: 'varchar', nullable: true })
  recogida_basura: string;

  @Column({ type: 'varchar', nullable: true })
  convivencia_animales: string;

  @Column({ type: 'varchar', nullable: true })
  lugar_preparacion_alimentos: string;

  @Column({ type: 'varchar', nullable: true })
  material_mesa_alimentos: string;

  @Column({ type: 'varchar', nullable: true })
  almacenamiento_alimentos: string;

  @Column({ type: 'varchar', nullable: true })
  almacenamiento_conjunto_productos: string;

  @Column({ type: 'varchar', nullable: true })
  notas: string;

  @ManyToOne(() => FichaEntity, ficha => ficha.tarjetasFamiliares)
  @JoinColumn({ name: 'ficha_id' })
  ficha: FichaEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
