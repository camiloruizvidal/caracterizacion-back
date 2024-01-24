import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tarjeta_familiar' })
export class TarjetaFamiliarEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
