import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString
} from 'class-validator';

export class UsuarioActualizarDTO {
  @Expose({ name: 'username' })
  @ApiProperty({
    description: 'Nombre de usuario',
    example: '10617161392'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario, puede ser vacía si no se actualiza',
    example: ''
  })
  @IsString()
  password: string;

  @ApiProperty({
    description:
      'Repetición de la contraseña, puede ser vacía si no se actualiza',
    example: ''
  })
  @IsString()
  passwordRepeat: string;

  @ApiProperty({
    description: 'Primer nombre del usuario'
  })
  @IsString()
  @IsNotEmpty()
  nombrePrimero: string;

  @ApiProperty({
    description: 'Segundo nombre del usuario, puede ser nulo',
    example: null
  })
  @IsString()
  @IsOptional()
  nombreSegundo: string | null;

  @ApiProperty({
    description: 'Primer apellido del usuario'
  })
  @IsString()
  @IsNotEmpty()
  apellidoPrimero: string;

  @ApiProperty({
    description: 'Segundo apellido del usuario, puede ser nulo',
    example: null
  })
  @IsString()
  @IsOptional()
  apellidoSegundo: string | null;

  @ApiProperty({
    description: 'Documento del usuario'
  })
  @IsNumberString()
  documento: string;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: 1
  })
  @IsNumber()
  documentoTipoId: number;

  @ApiProperty({
    description: 'ID del rol del usuario',
    example: 2
  })
  @IsNumber()
  rolId: number;

  @ApiProperty({
    description: 'Código inicial del rango, puede ser vacío'
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (value.trim() === '' ? null : Number(value)))
  codigoInicial: number | null;

  @ApiProperty({
    description: 'Código final del rango, puede ser vacío'
  })
  @IsNumberString()
  @IsOptional()
  @Transform(({ value }) => (value.trim() === '' ? null : Number(value)))
  codigoFinal: number | null;

  @ApiProperty({
    description: 'Indica si el usuario está inactivo',
    example: false
  })
  @IsBoolean()
  inactivo: boolean;
}
