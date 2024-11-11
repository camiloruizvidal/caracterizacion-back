// src/models/psicosocial_persona.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Ficha } from './ficha.model';

@Table({ tableName: 'psicosocial_persona' })
export class PsicosocialPersona extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    field: 'ustedes_recibieron_ayuda',
    allowNull: true
  })
  ustedesRecibieronAyuda: string;

  @Column({
    type: DataType.STRING,
    field: 'ustedes_recibieron_ayuda_de_quien',
    allowNull: true
  })
  ustedesRecibieronAyudaDeQuien: string;

  @Column({
    type: DataType.STRING,
    field: 'ustedes_recibieron_ayuda_que_tipo',
    allowNull: true
  })
  ustedesRecibieronAyudaQueTipo: string;

  @Column({
    type: DataType.STRING,
    field: 'principal_necesidad',
    allowNull: true
  })
  principalNecesidad: string;

  @Column({ type: DataType.STRING, allowNull: true })
  desplazamiento: string;

  @Column({ type: DataType.STRING, field: 'de_que_lugar', allowNull: true })
  deQueLugar: string;

  @Column({ type: DataType.STRING, field: 'deseos_volver', allowNull: true })
  deseosVolver: string;

  // Continúa con los campos adicionales aquí...

  @ForeignKey(() => Ficha)
  @Column({ type: DataType.INTEGER, field: 'ficha_id' })
  fichaId: number;

  @ForeignKey(() => Paciente)
  @Column({ type: DataType.INTEGER, field: 'paciente_id' })
  personaId: number;

  @BelongsTo(() => Ficha)
  ficha: Ficha;

  @BelongsTo(() => Paciente)
  persona: Paciente;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  updatedAt: Date;
}
