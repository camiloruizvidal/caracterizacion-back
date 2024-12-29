import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';

class ValueDto {
  @IsString()
  label: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  options: Record<string, any> | null;

  @IsBoolean()
  visibility: boolean;

  @IsBoolean()
  required: boolean;

  @IsString()
  columnName: string;

  @IsOptional()
  default: any;

  @IsOptional()
  value: any;

  @IsInt()
  orden: number;
}

class DataEntryDto {
  @IsInt()
  id: number;

  @IsInt()
  orden: number;

  @IsOptional()
  @IsObject()
  table: any | null;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueDto)
  values: ValueDto[];

  @IsString()
  subtitle: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class FichaJsonParamsDto {
  @IsInt()
  id: number;

  @IsBoolean()
  isFinish: boolean;

  @IsString()
  version: string;

  @IsString()
  nombre: string;

  @IsDateString()
  dateLastVersion: string;

  @IsString()
  grupalNombre: string;

  @IsString()
  individualNombre: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataEntryDto)
  grupalData: DataEntryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataEntryDto)
  individualData: DataEntryDto[];

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
