import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ficha_grupo', timestamps: false })
export class FichaGrupo extends Model {
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  subtitle: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  orden: number;



  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  table: string;

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
