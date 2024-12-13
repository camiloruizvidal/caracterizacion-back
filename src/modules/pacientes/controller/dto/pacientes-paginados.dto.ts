import { ApiProperty } from '@nestjs/swagger';
import { PacienteDto } from './pacientes.dto';
import { Expose, plainToInstance, Transform } from 'class-transformer';

export class PacientesPaginadosDto {
  @ApiProperty({ isArray: true, type: PacienteDto })
  @Transform(({ value }) => plainToInstance(PacienteDto, value))
  @Expose({ name: 'data' })
  data: PacienteDto[];

  @ApiProperty()
  @Expose({ name: 'totalItems' })
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  itemsPerPage: number;
}
