import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'persona' })
export class PersonaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  nombre_primero: string;

  @Column({ nullable: true })
  nombre_segundo: string;

  @Column({ nullable: true })
  apellido_primero: string;

  @Column({ nullable: true })
  apellido_segundo: string;

  @Column({ nullable: true })
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
  aporta_ingresos: string;

  @Column({ nullable: true })
  nivel_escolaridad: string;

  @Column({ nullable: true })
  afilicion_salud_tipo: string;

  @Column({ nullable: true })
  grupo_atencion_especial: string;

  @Column({ nullable: true })
  discapacidad: string;
}
