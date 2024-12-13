import { IStatus } from './../../../utils/global.interface';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'backup' })
export class Backup extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  data: string;

  @Column({
    type: DataType.ENUM(...Object.values(IStatus)),
    defaultValue: IStatus.Almacenado
  })
  status: IStatus;

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
