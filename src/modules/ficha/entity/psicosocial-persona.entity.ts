import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
import { PersonaEntity } from './persona.entity';
import { FichaEntity } from './ficha.entity';

@Entity('psicosocial_persona')
export class PsicosocialPersonaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ustedes_recibieron_ayuda', type: 'varchar', nullable: true })
  ustedesRecibieronAyuda: string;

  @Column({
    name: 'ustedes_recibieron_ayuda_de_quien',
    type: 'varchar',
    nullable: true
  })
  ustedesRecibieronAyudaDeQuien: string;

  @Column({
    name: 'ustedes_recibieron_ayuda_que_tipo',
    type: 'varchar',
    nullable: true
  })
  ustedesRecibieronAyudaQueTipo: string;

  @Column({ name: 'principal_necesidad', type: 'varchar', nullable: true })
  principalNecesidad: string;

  @Column({ type: 'varchar', nullable: true })
  desplazamiento: string;

  @Column({ name: 'de_que_lugar', type: 'varchar', nullable: true })
  deQueLugar: string;

  @Column({ name: 'deseos_volver', type: 'varchar', nullable: true })
  deseosVolver: string;

  @Column({
    name: 'despues_desplazamiento_rechazo_discriminacion',
    type: 'varchar',
    nullable: true
  })
  despuesDesplazamientoRechazoDiscriminacion: string;

  @Column({
    name: 'cambios_despues_desplazamiento',
    type: 'varchar',
    nullable: true
  })
  cambiosDespuesDesplazamiento: string;

  @Column({
    name: 'afectados_negativamente_desplazamiento',
    type: 'varchar',
    nullable: true
  })
  afectadosNegativamenteDesplazamiento: string;

  @Column({ name: 'desplazamiento_positivo', type: 'varchar', nullable: true })
  desplazamientoPositivo: string;

  @Column({ name: 'a_gusto_en_vivienda', type: 'varchar', nullable: true })
  aGustoEnVivienda: string;

  @Column({
    name: 'que_le_gusta_o_menos_gusta',
    type: 'varchar',
    nullable: true
  })
  queLeGustaOMenosGusta: string;

  @Column({
    name: 'lugar_preferido_dentro_casa',
    type: 'varchar',
    nullable: true
  })
  lugarPreferidoDentroCasa: string;

  @Column({ name: 'consumo_alimentos', type: 'varchar', nullable: true })
  consumoAlimentos: string;

  @Column({
    name: 'casos_maltrato_o_violencia',
    type: 'varchar',
    nullable: true
  })
  casosMaltratoOViolencia: string;

  @Column({ name: 'ayuda_o_denuncia', type: 'varchar', nullable: true })
  ayudaODenuncia: string;

  @Column({
    name: 'decisiones_importantes_en_familia',
    type: 'varchar',
    nullable: true
  })
  decisionesImportantesEnFamilia: string;

  @Column({
    name: 'correccion_de_problemas_en_familia',
    type: 'varchar',
    nullable: true
  })
  correccionDeProblemasEnFamilia: string;

  @Column({
    name: 'resolucion_problemas_en_comunidad',
    type: 'varchar',
    nullable: true
  })
  resolucionProblemasEnComunidad: string;

  @Column({ name: 'necesidad_capacitarse', type: 'varchar', nullable: true })
  necesidadCapacitarse: string;

  @Column({
    name: 'en_que_o_porque_capacitarse',
    type: 'varchar',
    nullable: true
  })
  enQueOPorqueCapacitarse: string;

  @Column({ name: 'emprender_negocio', type: 'varchar', nullable: true })
  emprenderNegocio: string;

  @Column({
    name: 'de_que_o_porque_emprender',
    type: 'varchar',
    nullable: true
  })
  deQueOPorqueEmprender: string;

  @Column({
    name: 'condiciones_vida_en_un_ano',
    type: 'varchar',
    nullable: true
  })
  condicionesVidaEnUnAno: string;

  @Column({ name: 'molestias_salud', type: 'varchar', nullable: true })
  molestiasSalud: string;

  @Column({
    name: 'cambios_en_menores_15_anos',
    type: 'varchar',
    nullable: true
  })
  cambiosEnMenores15Anos: string;

  @Column({ name: 'dedicacion_tiempo_libre', type: 'varchar', nullable: true })
  dedicacionTiempoLibre: string;

  @Column({ name: 'felicidad_actual', type: 'varchar', nullable: true })
  felicidadActual: string;

  @Column({ name: 'persona_id' })
  personaId: number;

  @Column({ name: 'ficha_id' })
  fichaId: number;

  @ManyToOne(() => FichaEntity, ficha => ficha.tarjetasFamiliares)
  @JoinColumn({ name: 'ficha_id' })
  ficha: FichaEntity;

  @JoinColumn({ name: 'persona_id' })
  persona: PersonaEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}
