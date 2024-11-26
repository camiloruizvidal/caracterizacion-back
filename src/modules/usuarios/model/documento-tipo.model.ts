import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript';

enum EPrefijo {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PA = 'PA',
  RC = 'RC'
}

enum ETipoDocumento {
  CEDULA_CIUDADANIA = 'Cédula de Ciudadanía',
  TARJETA_IDENTIDAD = 'Tarjeta de Identidad',
  CEDULA_EXTRANJERIA = 'Cédula de Extranjería',
  PASAPORTE = 'Pasaporte',
  REGISTRO_CIVIL = 'Registro Civil'
}

@Table({ tableName: 'documento_tipo', timestamps: false })
export class DocumentoTipo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(EPrefijo.CC)
  @Column({
    type: DataType.ENUM(...Object.values(EPrefijo))
  })
  prefijo: EPrefijo;

  @Default(ETipoDocumento.CEDULA_CIUDADANIA)
  @Column({
    type: DataType.ENUM(...Object.values(ETipoDocumento)),
    field: 'tipoDocumento'
  })
  tipoDocumento: ETipoDocumento;

  @Column(DataType.STRING)
  nombre: string;
}
