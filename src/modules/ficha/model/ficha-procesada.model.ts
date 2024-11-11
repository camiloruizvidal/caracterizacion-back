import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

@Table({ tableName: 'ficha_procesada' })
export class FichaProcesada extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'usuario_creacion_id',
    allowNull: false
  })
  usuarioCreacionId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  version: number;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  dateLastVersion: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  dateRegister: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  codigo: number;

  @Column({
    type: DataType.JSON
  })
  familyCard: any;

  @Column({
    type: DataType.JSON
  })
  personCard: any;

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

  @BelongsTo(() => User)
  usuario_creacion: User;
}
