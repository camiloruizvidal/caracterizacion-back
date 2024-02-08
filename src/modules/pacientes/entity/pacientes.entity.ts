import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('pacientes')
export class PacienteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre_primero: string;

  @Column({ nullable: true })
  nombre_segundo: string;

  @Column({ nullable: false })
  apellido_primero: string;

  @Column({ nullable: true })
  apellido_segundo: string;

  @Column({ nullable: false })
  documento: string;

  @Column({ nullable: true })
  sexo: string;

  @Column({ nullable: true })
  fecha_nacimiento: Date;

  @Column({ nullable: true })
  parentesco: string;

  @Column({ nullable: true })
  ocupacion: string;

  @Column({ nullable: true })
  aporta_ingresos: boolean;

  @Column({ nullable: true })
  nivel_escolaridad: string;

  @Column({ nullable: true })
  afiliacion_salud_tipo: string;

  @Column({ nullable: true })
  grupo_atencion_especial: string;

  @Column({ nullable: true })
  tiene_discapacidad: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
