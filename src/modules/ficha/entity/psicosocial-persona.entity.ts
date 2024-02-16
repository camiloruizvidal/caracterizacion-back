import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { PersonaEntity } from './persona.entity';

@Entity('psicosocial_persona')
export class PsicosocialPersonaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ustedes_recibieron_ayuda', type: 'boolean', nullable: true })
  ustedesRecibieronAyuda: boolean;

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

  @Column({ type: 'boolean', nullable: true })
  desplazamiento: boolean;

  @Column({ name: 'de_que_lugar', type: 'varchar', nullable: true })
  deQueLugar: string;

  @Column({ name: 'deseos_volver', type: 'boolean', nullable: true })
  deseosVolver: boolean;

  @Column({
    name: 'despues_desplazamiento_rechazo_discriminacion',
    type: 'boolean',
    nullable: true
  })
  despuesDesplazamientoRechazoDiscriminacion: boolean;

  @Column({
    name: 'cambios_despues_desplazamiento',
    type: 'boolean',
    nullable: true
  })
  cambiosDespuesDesplazamiento: boolean;

  @Column({
    name: 'afectados_negativamente_desplazamiento',
    type: 'boolean',
    nullable: true
  })
  afectadosNegativamenteDesplazamiento: boolean;

  @Column({ name: 'desplazamiento_positivo', type: 'boolean', nullable: true })
  desplazamientoPositivo: boolean;

  @Column({ name: 'a_gusto_en_vivienda', type: 'boolean', nullable: true })
  aGustoEnVivienda: boolean;

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

  @Column({ name: 'consumo_alimentos', type: 'boolean', nullable: true })
  consumoAlimentos: boolean;

  @Column({
    name: 'casos_maltrato_o_violencia',
    type: 'boolean',
    nullable: true
  })
  casosMaltratoOViolencia: boolean;

  @Column({ name: 'ayuda_o_denuncia', type: 'boolean', nullable: true })
  ayudaODenuncia: boolean;

  @Column({
    name: 'decisiones_importantes_en_familia',
    type: 'boolean',
    nullable: true
  })
  decisionesImportantesEnFamilia: boolean;

  @Column({
    name: 'correccion_de_problemas_en_familia',
    type: 'boolean',
    nullable: true
  })
  correccionDeProblemasEnFamilia: boolean;

  @Column({
    name: 'resolucion_problemas_en_comunidad',
    type: 'boolean',
    nullable: true
  })
  resolucionProblemasEnComunidad: boolean;

  @Column({ name: 'necesidad_capacitarse', type: 'boolean', nullable: true })
  necesidadCapacitarse: boolean;

  @Column({
    name: 'en_que_o_porque_capacitarse',
    type: 'varchar',
    nullable: true
  })
  enQueOPorqueCapacitarse: string;

  @Column({ name: 'emprender_negocio', type: 'boolean', nullable: true })
  emprenderNegocio: boolean;

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

  @Column({ name: 'molestias_salud', type: 'boolean', nullable: true })
  molestiasSalud: boolean;

  @Column({
    name: 'cambios_en_menores_15_anos',
    type: 'boolean',
    nullable: true
  })
  cambiosEnMenores15Anos: boolean;

  @Column({ name: 'dedicacion_tiempo_libre', type: 'varchar', nullable: true })
  dedicacionTiempoLibre: string;

  @Column({ name: 'felicidad_actual', type: 'boolean', nullable: true })
  felicidadActual: boolean;

  @ManyToOne(() => PersonaEntity, persona => persona.psicosocial)
  @JoinColumn({ name: 'persona_id' })
  persona: PersonaEntity;
}
