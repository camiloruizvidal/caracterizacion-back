import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Alertas } from './alertas.model';

@Table({ tableName: 'alertas_tipo', timestamps: false })
export class AlertasTipo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nombre: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true
  })
  valor_maximo: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true
  })
  valor_minimo: number;

  @HasMany(() => Alertas)
  alertas: Alertas[];
}
