import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { TarjetaFamiliarEntity } from './tarjetaFamiliar.entity';
import { PsicosocialPersonaEntity } from './psicosocial-persona.entity';

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

  @OneToMany(() => TarjetaFamiliarEntity, tarjeta => tarjeta.ficha)
  tarjetasFamiliares: TarjetaFamiliarEntity[];

  @OneToMany(
    () => PsicosocialPersonaEntity,
    psicosocialPersona => psicosocialPersona.ficha
  )
  psicosocialPersonas: PsicosocialPersonaEntity[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}
