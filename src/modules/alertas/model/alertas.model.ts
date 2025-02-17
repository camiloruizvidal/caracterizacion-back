import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { AlertasTipo } from './alertas-tipo.model';

@Table({ tableName: 'alertas', timestamps: false })
export class Alertas extends Model<Alertas> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @ForeignKey(() => AlertasTipo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  alerta_tipo_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  codigo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nombre: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  descripcion: string;

  @BelongsTo(() => AlertasTipo)
  alertaTipo: AlertasTipo;
}
