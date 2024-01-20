import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ficha' })
export class FichaEntity {

  @PrimaryGeneratedColumn()
  id: number;

}