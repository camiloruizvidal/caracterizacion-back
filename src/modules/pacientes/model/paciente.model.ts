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
    allowNull: true
  })
  documentoTipo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  documentoNumero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  genero: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nombrePrimero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  nombreSegundo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  apellidoPrimero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  apellidoSegundo: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  fechaNacimiento: Date;

  @Column({
    type: DataType.STRING,
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
    allowNull: true
  })
  aportaIngresos: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  nivelEscolaridad: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  tipoAfiliacionSalud: string;

  @Column({
    type: DataType.STRING,
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
