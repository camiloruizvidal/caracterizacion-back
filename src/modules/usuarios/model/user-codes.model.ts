import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'user_codes' })
export class UserCodes extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  start: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  finish: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id'
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
