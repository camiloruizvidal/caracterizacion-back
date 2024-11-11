import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'version' })
export class Version extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.DATE,
    field: 'date_last_version',
    allowNull: true
  })
  dateLastVersion: Date;

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
