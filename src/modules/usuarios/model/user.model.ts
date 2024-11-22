import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Ficha } from './../../ficha/model/ficha.model';
import { UserRoles } from './user-roles.model';
import { UserCodes } from './user-codes.model';

@Table({ tableName: 'user', timestamps: false })
export class User extends Model {
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
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'password'
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'nombre_primero'
  })
  nombrePrimero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'nombre_segundo'
  })
  nombreSegundo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'apellido_primero'
  })
  apellidoPrimero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'apellido_segundo'
  })
  apellidoSegundo: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  documento: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'documento_tipo_id'
  })
  documentoTipoId: number;

  @ForeignKey(() => UserRoles)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'rol_id'
  })
  rolId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  inactivo: boolean;

  @BelongsTo(() => UserRoles)
  roles: UserRoles;

  @HasMany(() => Ficha)
  fichas: Ficha[];

  @HasMany(() => UserCodes)
  codes: UserCodes[];
}
