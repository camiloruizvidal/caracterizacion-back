import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
import { FichaGrupoEntity } from './fichaGrupo.entity';
import { ESteperType } from '../interface/ficha.interface';

@Entity({ name: 'ficha_descripcion' })
export class FichaDescripcionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'nombre_columna' })
  columnName: string;

  @Column({ nullable: true, name: 'orden' })
  orden: number;

  @Column({ nullable: true, name: 'label' })
  label: string;

  @Column({ nullable: true, name: 'description' })
  description: string;

  @Column({ type: 'enum', enum: ESteperType, default: ESteperType.Text })
  type: ESteperType;

  @Column({ nullable: true })
  options: string;

  @Column({ nullable: true })
  default: string;

  @Column({ nullable: true })
  visibility: string;

  @Column({ nullable: true })
  required: string;

  @Column()
  ficha_grupo_id: number;

  @ManyToOne(() => FichaGrupoEntity, fichaGrupo => fichaGrupo.id)
  @JoinColumn({ name: 'ficha_grupo_id' })
  fichaGrupo: FichaGrupoEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
