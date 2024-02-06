import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserCodes } from './UserCodes';

@Index('UQ_688c284f790d3d31031253fd616', ['documento'], { unique: true })
@Entity('user', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'password' })
  password: string;

  @Column('character varying', { name: 'nombre_primero' })
  nombrePrimero: string;

  @Column('character varying', { name: 'nombre_segundo', nullable: true })
  nombreSegundo: string | null;

  @Column('character varying', { name: 'apellido_primero' })
  apellidoPrimero: string;

  @Column('character varying', { name: 'apellido_segundo', nullable: true })
  apellidoSegundo: string | null;

  @Column('character varying', { name: 'documento', unique: true })
  documento: string;

  @Column('integer', { name: 'documento_tipo_id' })
  documentoTipoId: number;

  @Column('character varying', { name: 'username' })
  username: string;

  @OneToMany(() => UserCodes, userCodes => userCodes.user)
  userCodes: UserCodes[];
}
