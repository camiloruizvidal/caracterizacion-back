import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { FichaGrupo } from './FichaGrupo';
import { ESteperType } from '../../interface/ficha.interface';

@Entity('ficha_descripcion', { schema: 'public' })
export class FichaDescripcion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nombre_columna', nullable: true })
  nombreColumna: string | null;

  @Column('integer', { name: 'orden', nullable: true })
  orden: number | null;

  @Column('character varying', { name: 'label', nullable: true })
  label: string | null;

  @Column('character varying', { name: 'description', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ESteperType,
    name: 'type',
    default: ESteperType.Text
  })
  type: ESteperType;

  @Column('character varying', { name: 'options', nullable: true })
  options: string | null;

  @Column('character varying', { name: 'default', nullable: true })
  default: string | null;

  @Column('character varying', { name: 'required', nullable: true })
  required: string | null;

  @Column('character varying', { name: 'visibility', nullable: true })
  visibility: string | null;

  @ManyToOne(() => FichaGrupo, fichaGrupo => fichaGrupo.fichaDescripcions)
  @JoinColumn([{ name: 'ficha_grupo_id', referencedColumnName: 'id' }])
  fichaGrupo: FichaGrupo;
}
