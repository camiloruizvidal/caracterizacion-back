import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ficha_json' })
export class FichaJson extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isFinish: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  version: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nombre: string;

  @Column({ type: DataType.DATE, allowNull: false })
  dateLastVersion: Date;

  @Column({ type: DataType.JSON })
  familyCard: Record<string, any>;

  @Column({ type: DataType.JSON })
  personCard: Record<string, any>;

  @Column({
    type: DataType.STRING,
    defaultValue: 'Tarjeta Familiar',
    field: 'nombre_grupal'
  })
  nombreGrupal: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'Tarjeta personal',
    field: 'nombre_individual'
  })
  nombreIndividual: string;

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
