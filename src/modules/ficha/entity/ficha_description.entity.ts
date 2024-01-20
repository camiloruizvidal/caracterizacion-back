import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FichaGrupoEntity } from './ficha_grupo.entity';

@Entity({ name: 'ficha_descripcion' })
export class FichaDescripcionEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_columna: string;

  @Column()
  validate: string;

  @Column()
  required: string;

  @Column()
  default: string;

  @Column()
  order: number;

  @Column()
  ficha_grupo_id: number;

  @ManyToOne(() => FichaGrupoEntity, fichaGrupo => fichaGrupo.id)
  @JoinColumn({ name: 'ficha_grupo_id' })
  fichaGrupo: FichaGrupoEntity;
}