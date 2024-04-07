import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'ficha_json' })
export class FichaJsonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isFinish: boolean;

  @Column()
  version: string;

  @Column()
  dateLastVersion: Date;

  @Column({ type: 'json' })
  familyCard: Record<string, any>;

  @Column({ type: 'json' })
  personCard: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
