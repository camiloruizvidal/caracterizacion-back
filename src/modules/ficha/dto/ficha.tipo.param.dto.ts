import { ETipoGrupo } from './../../../utils/global.interface';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsArray,
  Min,
  Max,
  IsObject
} from 'class-validator';
import { IAlerta } from '../interface/ficha.interface';

export class ClasificacionAlertaDto {
  @IsString()
  nombre: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rango_minimo: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  rango_maximo: number;

  @IsString()
  @IsOptional()
  color?: string;
}

export class AlertaDto {
  @IsBoolean()
  genera_alerta: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClasificacionAlertaDto)
  clasificaciones: ClasificacionAlertaDto[];
}

export class FichaTipoParamDto {
  @Expose({ name: 'version_ficha' })
  @IsNumber()
  versionFicha: number;

  @Expose({ name: 'tipo' })
  @IsEnum(ETipoGrupo)
  tipo: ETipoGrupo;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsObject()
  alerta?: IAlerta;
}
