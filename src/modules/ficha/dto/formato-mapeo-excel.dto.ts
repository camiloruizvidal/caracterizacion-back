import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class MapeoColumnaDto {
  @IsString()
  categoriaId: string;

  @IsString()
  preguntaId: string;

  @IsString()
  columnaExcel: string;

  @IsBoolean()
  esBusqueda: boolean;
}

export class FormatoMapeoExcelDto {
  @IsNumber()
  fichaJsonId: number;

  @IsArray()
  @IsString({ each: true })
  columnasExcel: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MapeoColumnaDto)
  mapeo: MapeoColumnaDto[];
}
