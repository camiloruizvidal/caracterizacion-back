import { PsicosocialPersona } from './../../ficha/model/psicosocial-persona.model';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'pacientes' })
export class Paciente extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    field: 'documento_tipo',
    allowNull: true
  })
  documentoTipo: string;

  @Column({
    field: 'documento_numero',
    type: DataType.STRING,
    allowNull: true,
    unique: true
  })
  documento_numero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  genero: string;

  @Column({
    type: DataType.STRING,
    field: 'nombre_primero',
    allowNull: false
  })
  nombrePrimero: string;

  @Column({
    type: DataType.STRING,
    field: 'nombre_segundo',
    allowNull: true
  })
  nombreSegundo: string;

  @Column({
    type: DataType.STRING,
    field: 'apellido_primero',
    allowNull: false
  })
  apellidoPrimero: string;

  @Column({
    type: DataType.STRING,
    field: 'apellido_segundo',
    allowNull: true
  })
  apellidoSegundo: string;

  @Column({
    type: DataType.DATE,
    field: 'fecha_nacimiento',
    allowNull: true
  })
  fechaNacimiento: Date;

  @Column({
    type: DataType.STRING,
    field: 'estado_civil',
    allowNull: true
  })
  estadoCivil: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  parentesco: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  ocupacion: string;

  @Column({
    type: DataType.STRING,
    field: 'aporta_ingresos',
    allowNull: true
  })
  aportaIngresos: string;

  @Column({
    type: DataType.STRING,
    field: 'nivel_escolaridad',
    allowNull: true
  })
  nivelEscolaridad: string;

  @Column({
    type: DataType.STRING,
    field: 'tipo_afiliacion_salud',
    allowNull: true
  })
  tipoAfiliacionSalud: string;

  @Column({
    type: DataType.STRING,
    field: 'grupo_atencion_especial',
    allowNull: true
  })
  grupoAtencionEspecial: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  discapacidad: string;

  @HasMany(() => PsicosocialPersona)
  psicosocialPersona: PsicosocialPersona[];

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'updated_at'
  })
  updatedAt: Date;
}
