import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { FichaJson } from './ficha-json.model';

@Table({
  tableName: 'mapeos_excel',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class MapeoExcel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  })
  id: number;

  @ForeignKey(() => FichaJson)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  ficha_json_id: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false
  })
  columnas_excel: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false
  })
  mapeo: Array<{
    categoriaId: string;
    preguntaId: string;
    columnaExcel: string;
    esBusqueda: boolean;
  }>;

  @BelongsTo(() => FichaJson)
  fichaJson: FichaJson;
}
