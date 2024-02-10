import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';

@Entity({ name: 'version' })
export class VersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date_last_version' })
  dateLastVersion: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
