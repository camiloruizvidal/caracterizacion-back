import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { FichaDescripcion } from './FichaDescripcion';
import { FichaTipo } from './FichaTipo';

@Entity('ficha_grupo', { schema: 'public' })
export class FichaGrupo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title' })
  title: string;

  @Column('character varying', { name: 'subtitle', nullable: true })
  subtitle: string | null;

  @Column('integer', { name: 'orden', nullable: true })
  orden: number | null;

  @OneToMany(
    () => FichaDescripcion,
    fichaDescripcion => fichaDescripcion.fichaGrupo
  )
  fichaDescripcions: FichaDescripcion[];

  @ManyToOne(() => FichaTipo, fichaTipo => fichaTipo.fichaGrupos)
  @JoinColumn([{ name: 'ficha_tipo_id', referencedColumnName: 'id' }])
  fichaTipo: FichaTipo;
}
