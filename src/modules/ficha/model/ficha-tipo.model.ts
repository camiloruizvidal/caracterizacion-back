import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ficha_tipo', timestamps: false })
export class FichaTipo extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nombre: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'createdAt'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'updatedAt'
  })
  updatedAt: Date;
}
