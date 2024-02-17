import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'ficha' })
export class FichaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: number;

  @Column()
  usuario_creacion_id: number;

  @Column()
  codigo: number;

  @Column()
  fecha_registro: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}
