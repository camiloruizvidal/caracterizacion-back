import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { RegistroExcelRepository } from '../../repository/registro-excel.repository';
import { Config } from 'src/Config/Config';
import * as XlsxStreamReader from 'xlsx-stream-reader';
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

      // Configurar el procesamiento por bloques
      const tamanoBloque = Config.TAMANIO_CHUNK_EXCEL;
      let registrosProcesados = 0;
      let bloqueActual: any[] = [];
      const encabezados: string[] = [];
      let filaActual = 0;

      return new Promise((resolve, reject) => {
        const reader = new XlsxStreamReader();
        const stream = fs.createReadStream(rutaArchivo);

        reader.on('worksheet', async workSheetReader => {
          if (workSheetReader.id === 1) {
            workSheetReader.on('row', async row => {
              try {
                filaActual++;

                // Si es la primera fila, obtener los encabezados
                if (filaActual === filaEncabezado) {
                  row.values.forEach((value, index) => {
                    if (index > 0) {
                      // ExcelJS agrega un valor vacío al inicio
                      encabezados[index - 1] = value as string;
                    }
                  });
                  return;
                }

                // Procesar filas de datos
                const registro: any = {};
                row.values.forEach((value, index) => {
                  if (index > 0) {
                    // ExcelJS agrega un valor vacío al inicio
                    registro[encabezados[index - 1]] = value;
                  }
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

                  // Actualizar la cantidad de registros procesados usando el repository
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

                  // Limpiar el bloque actual
                  bloqueActual = [];
                }
              } catch (error) {
                console.error(`Error procesando fila ${filaActual}:`, error);
                await CargaService.actualizarEstadoCarga(
                  idCarga,
                  EEstadoCargaEnum.ERROR,
                  `Error procesando fila ${filaActual}: ${error.message}`
                );
                reject(error);
              }
            });

            workSheetReader.on('end', async () => {
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
            });
          }
        });

        reader.on('end', () => {
          console.log('Lectura del archivo completada');
        });

        reader.on('error', error => {
          console.error('Error al leer el archivo:', error);
          reject(error);
        });

        stream.pipe(reader);
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
