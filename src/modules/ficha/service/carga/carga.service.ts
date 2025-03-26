import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { RegistroExcelRepository } from '../../repository/registro-excel.repository';
import { Config } from 'src/Config/Config';
import * as ExcelJS from 'exceljs';
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
      await CargaService.actualizarEstadoCarga(
        idCarga,
        EEstadoCargaEnum.PROCESANDO
      );

      // Configurar el procesamiento por bloques
      const tamanoBloque = Config.TAMANIO_CHUNK_EXCEL;
      let registrosProcesados = 0;
      let bloqueActual: any[] = [];
      const encabezados: string[] = [];

      const stream = fs.createReadStream(rutaArchivo);
      const workbook = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
        styles: 'ignore',
        sharedStrings: 'ignore',
        worksheets: 'emit'
      });

      return new Promise((resolve, reject) => {
        let isFirstRow = true;

        workbook.on('worksheet', worksheet => {
          worksheet.on('row', async row => {
            try {
              if (isFirstRow) {
                // Procesar encabezados
                row.eachCell((cell, colNumber) => {
                  encabezados[colNumber - 1] = cell.value?.toString() || '';
                });
                isFirstRow = false;
                return;
              }

              // Procesar fila de datos
              const registro: any = {};
              row.eachCell((cell, colNumber) => {
                registro[encabezados[colNumber - 1]] = cell.value;
              });

              bloqueActual.push({
                cargaId: idCarga,
                fichaId: idCarga,
                datosJson: registro
              });

              // Si llegamos al tamaño del bloque, procesamos
              if (bloqueActual.length >= tamanoBloque) {
                console.log(
                  `Procesando bloque ${Math.floor(registrosProcesados / tamanoBloque) + 1}: ${bloqueActual.length} registros`
                );

                await RegistroExcelRepository.guardarRegistrosBulk(
                  bloqueActual
                );
                registrosProcesados += bloqueActual.length;

                // Actualizar la cantidad de registros procesados
                const [filasActualizadas] =
                  await CargaRepository.actualizarCantidadRegistros(
                    idCarga,
                    registrosProcesados
                  );

                if (filasActualizadas === 0) {
                  console.warn(
                    `No se pudo actualizar la cantidad de registros para la carga ${idCarga}`
                  );
                }

                console.log(
                  `Bloque ${Math.floor(registrosProcesados / tamanoBloque) + 1} procesado exitosamente. Total registros procesados: ${registrosProcesados}`
                );

                bloqueActual = [];
              }
            } catch (error) {
              console.error('Error procesando fila:', error);
              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.ERROR,
                error.message
              );
              reject(error);
            }
          });

          worksheet.on('end', async () => {
            try {
              // Procesar el último bloque si existe
              if (bloqueActual.length > 0) {
                console.log(
                  `Procesando bloque final: ${bloqueActual.length} registros`
                );

                await RegistroExcelRepository.guardarRegistrosBulk(
                  bloqueActual
                );
                registrosProcesados += bloqueActual.length;

                // Actualizar la cantidad final de registros procesados
                await CargaRepository.actualizarCantidadRegistros(
                  idCarga,
                  registrosProcesados
                );
              }

              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.CARGADO
              );
              console.log(
                `Procesamiento completado. Total de registros procesados: ${registrosProcesados}`
              );
              resolve();
            } catch (error) {
              console.error('Error procesando bloque final:', error);
              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.ERROR,
                error.message
              );
              reject(error);
            }
          });
        });

        workbook.on('error', async error => {
          console.error('Error leyendo el archivo Excel:', error);
          await CargaService.actualizarEstadoCarga(
            idCarga,
            EEstadoCargaEnum.ERROR,
            error.message
          );
          reject(error);
        });

        workbook.on('end', () => {
          console.log('Lectura del archivo completada');
        });
      });
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
