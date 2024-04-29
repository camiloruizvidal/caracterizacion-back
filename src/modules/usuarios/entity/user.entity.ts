import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => UserRolesEntity, userRole => userRole.id)
  @JoinColumn({ name: 'rol_id', referencedColumnName: 'id' })
  roles: UserRolesEntity;

  @OneToMany(() => FichaEntity, ficha => ficha.usuario_creacion)
  @JoinColumn({ name: 'id' })
  fichas: FichaEntity[];

  @OneToMany(() => UserCodesEntity, codes => codes.user)
  @JoinColumn({ name: 'id' })
  codigos: UserCodesEntity[];
}
