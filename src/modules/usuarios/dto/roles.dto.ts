import { Expose } from 'class-transformer';

export class RolesDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'type' })
  type: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}
