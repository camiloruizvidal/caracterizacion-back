import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { FichaJson } from './ficha-json.model';
import { Carga } from './carga.model';

@Table({
  tableName: 'registros_excel',
  timestamps: true,
  createdAt: 'created_at'
})
export class RegistroExcel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  })
  id!: number;

  @ForeignKey(() => Carga)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'carga_id'
  })
  cargaId!: number;

  @ForeignKey(() => FichaJson)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'ficha_id'
  })
  fichaId!: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'datos_json'
  })
  datosJson!: any;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at'
  })
  createdAt!: Date;

  @BelongsTo(() => Carga)
  carga!: Carga;

  @BelongsTo(() => FichaJson)
  ficha!: FichaJson;
}
