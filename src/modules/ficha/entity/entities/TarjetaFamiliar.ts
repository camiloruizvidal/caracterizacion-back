import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tarjeta_familiar', { schema: 'public' })
export class TarjetaFamiliar {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;
}
