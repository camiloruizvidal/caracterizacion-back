import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PsicosocialPersonaEntity } from './psicosocial-persona.entity';
import { TarjetaFamiliarEntity } from './tarjeta-familiar.entity';
import { UserEntity } from 'src/modules/usuarios/entity/user.entity';

@Entity({ name: 'ficha' })
export class FichaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: number;

  @Column()
  usuario_creacion_id: number;

  @ManyToOne(() => UserEntity, user => user.fichas)
  @JoinColumn({ name: 'usuario_creacion_id' })
  usuario_creacion: UserEntity;

  @Column()
  codigo: number;

  @Column()
  fecha_registro: Date;

  @OneToOne(() => TarjetaFamiliarEntity, tarjeta => tarjeta.ficha)
  tarjetasFamiliares: TarjetaFamiliarEntity;

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
