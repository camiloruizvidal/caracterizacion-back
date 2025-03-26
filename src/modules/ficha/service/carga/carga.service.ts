import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { RegistroExcelRepository } from '../../repository/registro-excel.repository';
import { Config } from 'src/Config/Config';
import * as fs from 'fs';
import * as unzipper from 'unzipper';
import * as sax from 'sax';

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

      const stream = fs
        .createReadStream(rutaArchivo)
        .pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of stream) {
        if (entry.path === 'xl/worksheets/sheet1.xml') {
          const saxStream = sax.createStream(true);
          let filaActual: any = {};
          let currentColIndex = -1;
          let currentValue = '';

          saxStream.on('opentag', node => {
            if (node.name === 'row') {
              filaActual = {};
              currentColIndex = -1;
            }
            if (node.name === 'c') {
              const cell = node.attributes.r;
              const colLetter = cell.replace(/[0-9]/g, '');
              currentColIndex = this.colLetterToIndex(colLetter);
            }
            if (node.name === 'v') {
              currentValue = '';
            }
          });

          saxStream.on('text', text => {
            currentValue += text;
          });

          saxStream.on('closetag', name => {
            if (name === 'v') {
              if (isFirstRow) {
                encabezados[currentColIndex] = currentValue;
              } else {
                const campo =
                  encabezados[currentColIndex] || `col_${currentColIndex}`;
                filaActual[campo] = currentValue;
              }
            }

            if (name === 'row') {
              if (!isFirstRow) {
                bloqueActual.push({
                  cargaId: idCarga,
                  fichaId: idCarga,
                  datosJson: filaActual
                });

                if (bloqueActual.length >= tamanoBloque) {
                  entry.pause(); // ✅ Pausa sobre el stream real
                  const bloqueNumero =
                    Math.floor(registrosProcesados / tamanoBloque) + 1;
                  console.log(
                    `📦 Procesando ${registrosProcesados + bloqueActual.length} registros, bloque ${bloqueNumero} de ${tamanoBloque} registros`
                  );

                  RegistroExcelRepository.guardarRegistrosBulk(bloqueActual)
                    .then(async () => {
                      registrosProcesados += bloqueActual.length;
                      console.log(
                        `✅ Bloque ${bloqueNumero} guardado. Total acumulado: ${registrosProcesados} registros.`
                      );
                      await CargaRepository.actualizarCantidadRegistros(
                        idCarga,
                        registrosProcesados
                      );
                      bloqueActual = [];
                      entry.resume(); // ✅ Reanuda después del insert
                    })
                    .catch(async error => {
                      console.error('❌ Error guardando bloque:', error);
                      await CargaService.actualizarEstadoCarga(
                        idCarga,
                        EEstadoCargaEnum.ERROR,
                        error.message
                      );
                      entry.resume(); // ⚠️ Reanuda para no bloquear
                    });
                }
              } else {
                isFirstRow = false;
              }
            }
          });

          saxStream.on('end', async () => {
            if (bloqueActual.length > 0) {
              await RegistroExcelRepository.guardarRegistrosBulk(bloqueActual);
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
          });

          saxStream.on('error', async error => {
            console.error('❌ Error en el parser SAX:', error);
            await CargaService.actualizarEstadoCarga(
              idCarga,
              EEstadoCargaEnum.ERROR,
              error.message
            );
          });

          entry.pipe(saxStream);
        } else {
          entry.autodrain();
        }
      }
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

  private colLetterToIndex(col: string): number {
    let index = 0;
    for (let i = 0; i < col.length; i++) {
      index *= 26;
      index += col.charCodeAt(i) - 64;
    }
    return index - 1;
  }
}
