import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ficha_grupo' })
export class FichaGrupoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

}