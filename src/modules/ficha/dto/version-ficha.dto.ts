import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VersionFichaDto {
  @Expose({ name: 'nombre' })
  @ApiProperty({
    description: 'Nombre de la ficha',
    example: 'Ficha de caracterización'
  })
  @IsString({ message: 'Debe ser de tipo string' })
  @IsNotEmpty({ message: 'No puede ser vacio' })
  nombre: string;

  @Expose({ name: 'nombre_grupal' })
  @ApiProperty({
    description: 'Nombre de ficha grupal',
    example: 'Ficha familiar'
  })
  @IsString({ message: 'Debe ser de tipo string' })
  @IsNotEmpty({ message: 'No puede ser vacio' })
  nombreGrupal: string;

  @Expose({ name: 'nombre_individual' })
  @ApiProperty({
    description: 'Nombre de ficha individual',
    example: 'Ficha personal'
  })
  @IsString({ message: 'Debe ser de tipo string' })
  @IsNotEmpty({ message: 'No puede ser vacio' })
  nombreIndividual: string;
}
