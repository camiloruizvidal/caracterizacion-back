import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { FichaTipoEntity } from './fichaTipo.entity';

@Entity({ name: 'ficha_grupo' })
export class FichaGrupoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ nullable: true })
  orden: number;

  @Column({ nullable: true })
  ficha_tipo_id: number;

  @ManyToOne(
    () => FichaTipoEntity,
    (fichaTipo: FichaTipoEntity) => fichaTipo.id
  )
  @JoinColumn({ name: 'ficha_tipo_id' })
  fichaTipo: FichaTipoEntity;
}
