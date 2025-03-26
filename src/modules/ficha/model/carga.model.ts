import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { FichaJson } from './ficha-json.model';
import { EEstadoCargaEnum } from '../enums/estado-carga.enum';

@Table({
  tableName: 'cargas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Carga extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  })
  id!: number;

  @ForeignKey(() => FichaJson)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'ficha_id'
  })
  fichaId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'url_archivo'
  })
  urlArchivo!: string;

  @Column({
    type: DataType.ENUM(...Object.values(EEstadoCargaEnum)),
    allowNull: false,
    defaultValue: EEstadoCargaEnum.INGRESADO,
    field: 'estado'
  })
  estado!: EEstadoCargaEnum;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at'
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at'
  })
  updatedAt!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'mensaje_error'
  })
  mensajeError?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'cantidad_registros'
  })
  cantidadRegistros!: number;

  @BelongsTo(() => FichaJson)
  ficha!: FichaJson;
}
