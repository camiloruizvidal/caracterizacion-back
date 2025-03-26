import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { ExcelService } from 'src/utils/excel.service';

export class CargaService {
  constructor(private readonly excelService: ExcelService) {}

  static async crearCarga(fichaId: number, urlArchivo: string): Promise<Carga> {
    try {
      return await CargaRepository.crearCarga(fichaId, urlArchivo);
    } catch (error) {
      throw new HttpException(
        'Error al crear la carga: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async obtenerCargaPorId(id: number): Promise<Carga> {
    const carga = await CargaRepository.obtenerCargaPorId(id);
    if (!carga) {
      throw new HttpException('Carga no encontrada', HttpStatus.NOT_FOUND);
    }
    return carga;
  }

  static async actualizarEstadoCarga(
    id: number,
    estado: EEstadoCargaEnum,
    mensajeError?: string
  ): Promise<Carga> {
    const carga = await CargaRepository.actualizarEstadoCarga(
      id,
      estado,
      mensajeError
    );
    if (!carga) {
      throw new HttpException('Carga no encontrada', HttpStatus.NOT_FOUND);
    }
    return carga;
  }

  async procesarArchivoExcel(
    cargaId: number,
    urlArchivo: string
  ): Promise<void> {
    try {
      // Actualizar estado a procesando
      await CargaService.actualizarEstadoCarga(
        cargaId,
        EEstadoCargaEnum.PROCESANDO
      );

      // Iniciar procesamiento del archivo
      await this.excelService.iniciarLectura(urlArchivo);

      // TODO: Implementar la lógica de procesamiento del Excel aquí
      // Por ejemplo:
      // const registros = await this.excelService.obtenerRegistros();
      // await this.procesarRegistros(registros, cargaId);

      // Actualizar estado a cargado
      await CargaService.actualizarEstadoCarga(
        cargaId,
        EEstadoCargaEnum.CARGADO
      );
    } catch (error) {
      throw error;
    }
  }
}
