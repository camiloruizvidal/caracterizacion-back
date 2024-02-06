import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('version', { schema: 'public' })
export class Version {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp without time zone', { name: 'date_last_version' })
  dateLastVersion: Date;
}
