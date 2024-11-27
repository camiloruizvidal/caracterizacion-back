// src/models/ficha.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany
} from 'sequelize-typescript';
import { PsicosocialPersona } from './psicosocial-persona.model';
import { TarjetaFamiliar } from './tarjeta-familiar.model';
import { User } from 'src/modules/usuarios/model/user.model';

@Table({ tableName: 'ficha', timestamps: false })
export class Ficha extends Model<Ficha> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  version: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'usuario_creacion_id'
  })
  usuarioCreacionId: number;

  @BelongsTo(() => User)
  usuario_creacion: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  codigo: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'fecha_registro'
  })
  fechaRegistro: Date;

  @HasOne(() => TarjetaFamiliar)
  tarjetasFamiliares: TarjetaFamiliar;

  @HasMany(() => PsicosocialPersona)
  psicosocialPersonas: PsicosocialPersona[];

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
