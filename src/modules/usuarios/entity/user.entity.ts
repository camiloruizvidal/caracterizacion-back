import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserRolesEntity } from './user-roles.entity';
import { FichaEntity } from 'src/modules/ficha/entity/ficha.entity';
import { UserCodesEntity } from './user-codes.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'nombre_primero' })
  nombrePrimero: string;

  @Column({ nullable: true, name: 'nombre_segundo' })
  nombreSegundo: string;

  @Column({ name: 'apellido_primero' })
  apellidoPrimero: string;

  @Column({ nullable: true, name: 'apellido_segundo' })
  apellidoSegundo: string;

  @Column({ unique: true })
  documento: string;

  @Column({ name: 'documento_tipo_id' })
  documentoTipoId: number;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ default: false })
  inactivo: boolean;

  @OneToOne(() => UserRolesEntity, userRoles => userRoles.user)
  roles: UserRolesEntity;

  @OneToMany(() => FichaEntity, ficha => ficha.usuario_creacion)
  fichas: FichaEntity[];

  @OneToMany(() => UserCodesEntity, codes => codes.user_id)
  codigos: UserCodesEntity[];
}
