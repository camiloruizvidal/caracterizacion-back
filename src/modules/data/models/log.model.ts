import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey
} from 'sequelize-typescript';

@Table({ tableName: 'log', timestamps: true })
export class Log extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'tipo'
  })
  tipo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'data'
  })
  data: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'updated_at'
  })
  updatedAt: Date;
}
