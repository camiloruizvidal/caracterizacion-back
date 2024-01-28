import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_codes' })
export class UserCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: number;

  @Column()
  finish: number;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
