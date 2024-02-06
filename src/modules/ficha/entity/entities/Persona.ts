import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('persona', { schema: 'public' })
export class Persona {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nombre_primero', nullable: true })
  nombrePrimero: string | null;

  @Column('character varying', { name: 'nombre_segundo', nullable: true })
  nombreSegundo: string | null;

  @Column('character varying', { name: 'apellido_primero', nullable: true })
  apellidoPrimero: string | null;

  @Column('character varying', { name: 'apellido_segundo', nullable: true })
  apellidoSegundo: string | null;

  @Column('character varying', { name: 'documento', nullable: true })
  documento: string | null;

  @Column('character varying', { name: 'sexo', nullable: true })
  sexo: string | null;

  @Column('timestamp without time zone', {
    name: 'fecha_nacimiento',
    nullable: true
  })
  fechaNacimiento: Date | null;

  @Column('character varying', { name: 'parentesco', nullable: true })
  parentesco: string | null;

  @Column('character varying', { name: 'ocupacion', nullable: true })
  ocupacion: string | null;

  @Column('character varying', { name: 'aporta_ingresos', nullable: true })
  aportaIngresos: string | null;

  @Column('character varying', { name: 'nivel_escolaridad', nullable: true })
  nivelEscolaridad: string | null;

  @Column('character varying', { name: 'afilicion_salud_tipo', nullable: true })
  afilicionSaludTipo: string | null;

  @Column('character varying', {
    name: 'grupo_atencion_especial',
    nullable: true
  })
  grupoAtencionEspecial: string | null;

  @Column('character varying', { name: 'discapacidad', nullable: true })
  discapacidad: string | null;
}
