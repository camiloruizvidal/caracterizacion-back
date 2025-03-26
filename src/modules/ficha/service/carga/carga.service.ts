import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { RegistroExcelRepository } from '../../repository/registro-excel.repository';
import { Config } from 'src/Config/Config';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';

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
      console.log(`Iniciando procesamiento del archivo: ${rutaArchivo}`);
      await CargaService.actualizarEstadoCarga(
        idCarga,
        EEstadoCargaEnum.PROCESANDO
      );

      const tamanoBloque = Config.TAMANIO_CHUNK_EXCEL;
      let registrosProcesados = 0;
      let bloqueActual: any[] = [];
      let encabezados: string[] = [];
      let isFirstRow = true;

      const stream = fs.createReadStream(rutaArchivo);
      const workbookReader: any = new ExcelJS.stream.xlsx.WorkbookReader(
        stream,
        {
          worksheets: 'emit',
          styles: 'ignore',
          sharedStrings: 'cache'
        }
      );

      return new Promise((resolve, reject) => {
        workbookReader.on('worksheet', worksheet => {
          console.log(
            '🟢 Hoja de Excel detectada, comenzando lectura de filas...'
          );

          worksheet.on('row', async row => {
            console.log(`📌 Primera fila leída: ${row.number}`);
            try {
              if (isFirstRow) {
                encabezados = row.values
                  .slice(1)
                  .map(cell => cell?.toString().trim());
                isFirstRow = false;
                console.log(
                  `Encabezados detectados: [${encabezados.join(', ')}]`
                );
                return;
              }

              const valores = row.values.slice(1);
              const registro: any = {};
              encabezados.forEach((campo, index) => {
                registro[campo] = valores[index];
              });

              bloqueActual.push({
                cargaId: idCarga,
                fichaId: idCarga,
                datosJson: registro
              });

              if (bloqueActual.length >= tamanoBloque) {
                const bloqueNumero =
                  Math.floor(registrosProcesados / tamanoBloque) + 1;
                console.log(
                  `📦 Procesando ${registrosProcesados + bloqueActual.length} registros, bloque ${bloqueNumero} de ${tamanoBloque} registros`
                );

                worksheet.pause();
                await RegistroExcelRepository.guardarRegistrosBulk(
                  bloqueActual
                );
                registrosProcesados += bloqueActual.length;

                console.log(
                  `✅ Bloque ${bloqueNumero} guardado. Total acumulado: ${registrosProcesados} registros.`
                );

                await CargaRepository.actualizarCantidadRegistros(
                  idCarga,
                  registrosProcesados
                );
                bloqueActual = [];
                worksheet.resume();
              }
            } catch (error) {
              console.error('❌ Error procesando fila:', error);
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
              console.log(
                '📄 Fin de hoja detectado. Procesando bloque final...'
              );
              if (bloqueActual.length > 0) {
                await RegistroExcelRepository.guardarRegistrosBulk(
                  bloqueActual
                );
                registrosProcesados += bloqueActual.length;
                await CargaRepository.actualizarCantidadRegistros(
                  idCarga,
                  registrosProcesados
                );
                console.log(
                  `✅ Bloque final guardado. Total registros procesados: ${registrosProcesados}`
                );
              }

              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.CARGADO
              );
              console.log('🎉 Carga completada correctamente.');
              resolve();
            } catch (error) {
              console.error('❌ Error procesando bloque final:', error);
              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.ERROR,
                error.message
              );
              reject(error);
            }
          });
        });

        workbookReader.on('error', async error => {
          console.error('❌ Error leyendo el archivo Excel:', error);
          await CargaService.actualizarEstadoCarga(
            idCarga,
            EEstadoCargaEnum.ERROR,
            error.message
          );
          reject(error);
        });

        workbookReader.on('end', () => {
          console.log('📚 Lectura de archivo completada.');
        });
      });
    } catch (error) {
      console.error('❌ Error general al procesar el Excel:', error);
      await CargaService.actualizarEstadoCarga(
        idCarga,
        EEstadoCargaEnum.ERROR,
        error.message
      );
      throw error;
    }
  }
}
