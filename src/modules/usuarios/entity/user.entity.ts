import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRolesEntity } from './user-roles.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
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

  @OneToMany(() => UserRolesEntity, userRoles => userRoles.user)
  roles: UserRolesEntity[];
}
