import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ name: 'nombre_primero' })
  nombrePrimero: string;

  @Column({ name: 'nombre_segundo' })
  nombreSegundo: string;

  @Column({ name: 'apellido_primero' })
  apellidoPrimero: string;

  @Column({ name: 'apellido_segundo' })
  apellidoSegundo: string;

  @Column()
  documento: string;

  @Column({ name: 'documento_tipo_id' })
  documentoTipoId: number;
}
