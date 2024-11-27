import { ApiProperty } from '@nestjs/swagger';

export class CodigosDto {
  @ApiProperty({ description: 'Inicio del rango', example: 1 })
  inicio: number;

  @ApiProperty({ description: 'Fin del rango', example: 100 })
  fin: number;
}
