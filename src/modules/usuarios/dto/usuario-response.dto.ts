import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UsuarioResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 18
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de usuario único (generalmente el documento)',
    example: '123456789'
  })
  username: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Pepito'
  })
  nombrePrimero: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del usuario (opcional)',
    example: 'Pepe'
  })
  nombreSegundo?: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Perez'
  })
  apellidoPrimero: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del usuario (opcional)',
    example: 'Pereza'
  })
  apellidoSegundo?: string;

  @ApiProperty({
    description: 'Número de documento del usuario',
    example: '123456789'
  })
  documento: string;

  @ApiProperty({
    description: 'Estado de inactividad del usuario',
    example: false
  })
  inactivo: boolean;

  @Exclude()
  password: string;

  @Exclude()
  rolId: number;

  @Exclude()
  documentoTipoId: number;
}
