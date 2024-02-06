import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FichaGrupo } from './FichaGrupo';

@Entity('ficha_tipo', { schema: 'public' })
export class FichaTipo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @OneToMany(() => FichaGrupo, fichaGrupo => fichaGrupo.fichaTipo)
  fichaGrupos: FichaGrupo[];
}
