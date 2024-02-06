import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';

@Entity('user_codes', { schema: 'public' })
export class UserCodes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'start' })
  start: number;

  @Column('integer', { name: 'finish' })
  finish: number;

  @ManyToOne(() => User, user => user.userCodes)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
