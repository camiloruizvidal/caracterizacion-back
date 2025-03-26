import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { RegistroExcelRepository } from '../../repository/registro-excel.repository';
import { Config } from 'src/Config/Config';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

export class CargaService {
  static async crearCarga(
    fichaId: number,
    rutaArchivo: string
  ): Promise<Carga> {
    try {
      return await CargaRepository.crearCarga(fichaId, rutaArchivo);
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
    idCarga: number,
    rutaArchivo: string
  ): Promise<void> {
    try {
      const filaEncabezado = 1;
      await CargaService.actualizarEstadoCarga(
        idCarga,
        EEstadoCargaEnum.PROCESANDO
      );

      const libro = XLSX.readFile(rutaArchivo);
      const hoja = libro.Sheets[libro.SheetNames[0]];

      const encabezados = XLSX.utils.sheet_to_json(hoja, {
        header: filaEncabezado
      })[0];

      const datosJson = XLSX.utils.sheet_to_json(hoja, {
        header: encabezados as string[],
        range: filaEncabezado
      });

      const tamanoBloque = Config.TAMANIO_CHUNK_EXCEL;
      for (let i = 0; i < datosJson.length; i += tamanoBloque) {
        try {
          const bloque = datosJson.slice(i, i + tamanoBloque);
          console.log(
            `Procesando bloque ${Math.floor(i / tamanoBloque) + 1}: ${bloque.length} registros`
          );

          const registrosTransformados = bloque.map(registro => ({
            cargaId: idCarga,
            fichaId: idCarga,
            datosJson: registro
          }));

          await RegistroExcelRepository.guardarRegistrosBulk(
            registrosTransformados
          );
          console.log(
            `Bloque ${Math.floor(i / tamanoBloque) + 1} procesado exitosamente`
          );
        } catch (error) {
          console.error(
            `Error procesando bloque ${Math.floor(i / tamanoBloque) + 1}:`,
            error
          );
          await CargaService.actualizarEstadoCarga(
            idCarga,
            EEstadoCargaEnum.ERROR,
            `Error procesando bloque ${Math.floor(i / tamanoBloque) + 1}: ${error.message}`
          );
          throw error;
        }
      }

      await CargaService.actualizarEstadoCarga(
        idCarga,
        EEstadoCargaEnum.CARGADO
      );
      console.log(
        `Procesamiento completado. Total de bloques procesados: ${Math.ceil(datosJson.length / tamanoBloque)}`
      );
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
      await CargaService.actualizarEstadoCarga(
        idCarga,
        EEstadoCargaEnum.ERROR,
        error.message
      );
      throw error;
    }
  }
}
