import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
export enum IStatus {
  Almacenado = 'almacenado',
  Fallo = 'fallo',
  Guardado = 'guardado'
}
class JsonTransformer {
  to(value: any): string {
    return JSON.stringify(value);
  }

  from(value: string): any {
    return JSON.parse(value);
  }
}

@Entity({ name: 'backup' })
export class BackupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true, transformer: new JsonTransformer() })
  data: string;

  @Column({
    type: 'enum',
    enum: IStatus,
    default: IStatus.Almacenado
  })
  status: IStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
