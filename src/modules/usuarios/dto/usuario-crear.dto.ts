import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsNumberString,
  IsNumber
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UsuarioCrearDto {
  @ApiProperty({
    description: 'Nombre de usuario único (generalmente el documento)',
    example: '123456789'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'asd123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Repetición de la contraseña para validación',
    example: 'asd123'
  })
  @IsString()
  @IsNotEmpty()
  passwordRepeat: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Pepito'
  })
  @IsString()
  @IsNotEmpty()
  nombrePrimero: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del usuario (opcional)',
    example: 'Pepe'
  })
  @IsString()
  @IsOptional()
  nombreSegundo: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Perez'
  })
  @IsString()
  @IsNotEmpty()
  apellidoPrimero: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del usuario (opcional)',
    example: 'Pereza'
  })
  @IsString()
  @IsOptional()
  apellidoSegundo: string;

  @ApiProperty({
    description: 'Número de documento del usuario',
    example: '123456789'
  })
  @IsNumberString()
  @IsNotEmpty()
  documento: string;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: '3'
  })
  @IsNumberString()
  @IsNotEmpty()
  documentoTipoId: string;

  @ApiProperty({
    description: 'ID del rol asociado al usuario',
    example: '1'
  })
  @IsNumberString()
  @IsNotEmpty()
  rolId: string;

  @ApiPropertyOptional({
    description: 'Código inicial (opcional)',
    example: ''
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value.trim() === '' ? null : Number(value)))
  codigoInicial: number | null;

  @ApiPropertyOptional({
    description: 'Código final (opcional)',
    example: ''
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value.trim() === '' ? null : Number(value)))
  codigoFinal: number | null;

  @ApiProperty({
    description: 'Estado de inactividad del usuario',
    example: false
  })
  @IsBoolean()
  @IsNotEmpty()
  inactivo: boolean;

  @ApiPropertyOptional({
    description: 'Número de identificación del Equipo Básico de Salud',
    example: 'EBS-12345'
  })
  @IsString()
  @IsOptional()
  numeroIdentificacionEBS?: string;

  @ApiPropertyOptional({
    description: 'Prestador primario del EBS',
    example: 'Hospital Central'
  })
  @IsString()
  @IsOptional()
  prestadorPrimarioEBS?: string;

  @ApiPropertyOptional({
    description:
      'Perfil de quien realiza la evaluación de necesidades en salud - caracterización',
    example: 'Enfermero Jefe'
  })
  @IsString()
  @IsOptional()
  perfilEvaluador?: string;
}
