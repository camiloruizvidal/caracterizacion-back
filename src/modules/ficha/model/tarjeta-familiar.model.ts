import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Ficha } from './ficha.model';

@Table({ tableName: 'tarjeta_familiar' })
export class TarjetaFamiliar extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  direccion: string;

  @Column({ type: DataType.STRING, allowNull: true })
  barrio: string;

  @Column({ type: DataType.STRING, allowNull: false })
  municipio: string;

  @Column({ type: DataType.STRING, allowNull: true })
  telefono: string;

  // Continúa con los campos adicionales aquí...

  @ForeignKey(() => Ficha)
  @Column({ type: DataType.INTEGER, field: 'ficha_id' })
  fichaId: number;

  @BelongsTo(() => Ficha)
  ficha: Ficha;

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
