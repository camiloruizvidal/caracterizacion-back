import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from 'src/modules/usuarios/entity/user.entity';

@Entity({ name: 'ficha_procesada' })
export class FichaProcesadaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_creacion_id' })
  usuarioCreacionId: number;

  @Column()
  version: number;

  @Column()
  dateLastVersion: Date;

  @Column()
  dateRegister: Date;

  @Column()
  codigo: number;

  @Column({ type: 'json' })
  familyCard: any;

  @Column({ type: 'json' })
  personCard: any;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;

  @ManyToOne(() => UserEntity, user => user.fichas)
  @JoinColumn({ name: 'usuario_creacion_id' })
  usuario_creacion: UserEntity;
}
