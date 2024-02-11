import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_roles')
export class UserRolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: string;

  @ManyToOne(() => UserEntity, user => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
