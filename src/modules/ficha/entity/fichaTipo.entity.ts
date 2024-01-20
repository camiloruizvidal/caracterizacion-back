import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ficha_tipo' })
export class FichaTipoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

}