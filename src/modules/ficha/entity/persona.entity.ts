import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { PsicosocialPersonaEntity } from './psicosocial-persona.entity';

@Entity('persona')
export class PersonaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'documento_tipo', type: 'varchar', nullable: false })
  documentoTipo: string;

  @Column({ name: 'documento_numero', type: 'varchar', nullable: false })
  documentoNumero: string;

  @Column({ type: 'varchar', nullable: false })
  genero: string;

  @Column({ name: 'nombre_primero', type: 'varchar', nullable: false })
  nombrePrimero: string;

  @Column({ name: 'nombre_segundo', type: 'varchar', nullable: true })
  nombreSegundo: string;

  @Column({ name: 'apellido_primero', type: 'varchar', nullable: false })
  apellidoPrimero: string;

  @Column({ name: 'apellido_segundo', type: 'varchar', nullable: true })
  apellidoSegundo: string;

  @Column({ name: 'estado_civil', type: 'varchar', nullable: false })
  estadoCivil: string;

  @Column({ type: 'varchar', nullable: false })
  parentesco: string;

  @Column({ type: 'varchar', nullable: false })
  ocupacion: string;

  @Column({ name: 'aporta_ingresos', type: 'varchar', nullable: false })
  aportaIngresos: string;

  @Column({ name: 'nivel_escolaridad', type: 'varchar', nullable: false })
  nivelEscolaridad: string;

  @Column({ name: 'tipo_afiliacion_salud', type: 'varchar', nullable: false })
  tipoAfiliacionSalud: string;

  @Column({ name: 'grupo_atencion_especial', type: 'varchar', nullable: false })
  grupoAtencionEspecial: string;

  @Column({ type: 'varchar', nullable: false })
  discapacidad: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @OneToOne(
    () => PsicosocialPersonaEntity,
    psicosocial => psicosocial.persona,
    {
      cascade: true
    }
  )
  @JoinColumn()
  psicosocial: PsicosocialPersonaEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
