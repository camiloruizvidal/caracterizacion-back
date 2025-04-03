import { IPagination } from 'src/utils/global.interface';
import { EEstadoGeneracionExcel } from '../models/generacion-excel.model';

export class GeneracionExcelPaginadoDto {
  id: number;
  version: number;
  rutaArchivo: string;
  estado: EEstadoGeneracionExcel;
  totalRegistros: number;
  registrosProcesados: number;
  fechaInicio: Date;
  fechaFin: Date;
  mensajeError: string;
  createdAt: Date;
  updatedAt: Date;

  static fromGeneracionExcel(generacionExcel: any): GeneracionExcelPaginadoDto {
    const dto = new GeneracionExcelPaginadoDto();
    dto.id = generacionExcel.id;
    dto.version = generacionExcel.version;
    dto.rutaArchivo = generacionExcel.rutaArchivo;
    dto.estado = generacionExcel.estado;
    dto.totalRegistros = generacionExcel.totalRegistros;
    dto.registrosProcesados = generacionExcel.registrosProcesados;
    dto.fechaInicio = generacionExcel.fechaInicio;
    dto.fechaFin = generacionExcel.fechaFin;
    dto.mensajeError = generacionExcel.mensajeError;
    dto.createdAt = generacionExcel.createdAt;
    dto.updatedAt = generacionExcel.updatedAt;
    return dto;
  }
}

export class GeneracionExcelPaginadoResponseDto
  implements IPagination<GeneracionExcelPaginadoDto>
{
  data: GeneracionExcelPaginadoDto[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export class GeneracionExcelQueryDto {
  page?: number;
  pageSize?: number;
  versionId?: number;
}
