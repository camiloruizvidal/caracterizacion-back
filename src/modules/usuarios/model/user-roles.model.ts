import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'user_roles' })
export class UserRoles extends Model {
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
  type: string;

  @HasOne(() => User)
  user: User;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'updated_at'
  })
  updatedAt: Date;
}
