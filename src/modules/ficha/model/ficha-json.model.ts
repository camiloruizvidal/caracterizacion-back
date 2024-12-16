import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey
} from 'sequelize-typescript';

@Table({ tableName: 'ficha_json' })
export class FichaJson extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_finish' })
  isFinish: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  version: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nombre: string;

  @Column({ type: DataType.DATE, allowNull: false })
  dateLastVersion: Date;

  @Column({ type: DataType.STRING, field: 'nombre_grupal' })
  grupalNombre: string;

  @Column({ type: DataType.STRING, field: 'nombre_individual' })
  individualNombre: string;

  @Column({ type: DataType.JSONB, field: 'grupal_data' })
  grupalData: string;

  @Column({ type: DataType.JSONB, field: 'individual_data' })
  individualData: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
