import { ApiProperty } from '@nestjs/swagger';
import { CodigosDto } from './codigos.dto';
import { Expose, Transform } from 'class-transformer';

export class UsuarioEditadoDto {
  @ApiProperty({ description: 'Nombre de usuario', example: '1061716139' })
  username: string;

  @ApiProperty({ description: 'Primer nombre del usuario', example: 'Pepito' })
  nombrePrimero: string;

  @ApiProperty({
    description: 'Segundo nombre del usuario, puede ser nulo',
    example: null
  })
  nombreSegundo: string | null;

  @ApiProperty({ description: 'Primer apellido del usuario', example: 'Perez' })
  apellidoPrimero: string;

  @ApiProperty({ description: 'Documento del usuario', example: '123456789' })
  documento: string;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: 1
  })
  documentoTipoId: number;

  @ApiProperty({
    description: 'ID del rol del usuario',
    example: 2
  })
  rolId: number;

  @Expose({ name: 'fichas' })
  @Transform(({ value }) => value ?? [])
  fichas: any[];

  @ApiProperty({
    description: 'Lista de códigos asociados al usuario',
    type: [CodigosDto],
    example: [{ inicio: 12, fin: 254 }]
  })
  @Expose({ name: 'codes' })
  codigos: CodigosDto[];
}
