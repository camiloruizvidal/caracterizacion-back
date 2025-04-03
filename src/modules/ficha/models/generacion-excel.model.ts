import { Column, Table, DataType, Model } from 'sequelize-typescript';

export enum EEstadoGeneracionExcel {
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  ERROR = 'ERROR'
}

@Table({
  tableName: 'generacion_excel',
  timestamps: true
})
export class GeneracionExcel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'version'
  })
  version: number;

  @Column({
    type: DataType.ENUM(...Object.values(EEstadoGeneracionExcel)),
    allowNull: false,
    defaultValue: EEstadoGeneracionExcel.EN_PROCESO,
    field: 'estado'
  })
  estado: EEstadoGeneracionExcel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_registros'
  })
  totalRegistros: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'registros_procesados'
  })
  registrosProcesados: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'fecha_inicio'
  })
  fechaInicio: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'fecha_fin'
  })
  fechaFin: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'ruta_archivo'
  })
  rutaArchivo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'mensaje_error'
  })
  mensajeError: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at'
  })
  updatedAt: Date;
}
