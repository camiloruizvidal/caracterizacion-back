import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'version' })
export class VersionEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date_last_version' })
  dateLastVersion: Date;

}