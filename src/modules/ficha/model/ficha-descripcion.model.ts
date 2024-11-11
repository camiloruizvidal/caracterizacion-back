import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { ESteperType } from '../interface/ficha.interface';
import { FichaGrupo } from './ficha-grupo.model';

@Table({ tableName: 'ficha_descripcion' })
export class FichaDescripcion extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'nombre_columna'
  })
  columnName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'orden'
  })
  orden: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'label'
  })
  label: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'description'
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(ESteperType)),
    defaultValue: ESteperType.Text
  })
  type: ESteperType;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  options: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  default: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  visibility: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  required: string;

  @ForeignKey(() => FichaGrupo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'ficha_grupo_id'
  })
  fichaGrupoId: number;

  @BelongsTo(() => FichaGrupo)
  fichaGrupo: FichaGrupo;

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
