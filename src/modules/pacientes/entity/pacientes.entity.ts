import { PsicosocialPersonaEntity } from 'src/modules/ficha/entity/psicosocial-persona.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('pacientes')
export class PacienteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  documento_tipo: string;

  @Column({ type: 'varchar', nullable: true })
  documento_numero: string;

  @Column({ type: 'varchar', nullable: true })
  genero: string;

  @Column({ type: 'varchar', nullable: false })
  nombre_primero: string;

  @Column({ type: 'varchar', nullable: true })
  nombre_segundo: string;

  @Column({ type: 'varchar', nullable: false })
  apellido_primero: string;

  @Column({ type: 'varchar', nullable: true })
  apellido_segundo: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'varchar', nullable: true })
  estado_civil: string;

  @Column({ type: 'varchar', nullable: true })
  parentesco: string;

  @Column({ type: 'varchar', nullable: true })
  ocupacion: string;

  @Column({ type: 'varchar', nullable: true })
  aporta_ingresos: string;

  @Column({ type: 'varchar', nullable: true })
  nivel_escolaridad: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_afiliacion_salud: string;

  @Column({ type: 'varchar', nullable: true })
  grupo_atencion_especial: string;

  @Column({ type: 'varchar', nullable: true })
  discapacidad: string;

  @OneToMany(
    () => PsicosocialPersonaEntity,
    psicosocialPersona => psicosocialPersona
  )
  PsicosocialPersona: PsicosocialPersonaEntity[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}
