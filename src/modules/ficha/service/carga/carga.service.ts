import { CargaRepository } from '../../repository/carga.repository';
import { EEstadoCargaEnum } from '../../enums/estado-carga.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Carga } from '../../model/carga.model';
import { RegistroExcelRepository } from '../../repository/registro-excel.repository';
import { Config } from 'src/Config/Config';
import * as fs from 'fs';
import * as unzipper from 'unzipper';
import * as sax from 'sax';
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

  private async obtenerEncabezados(rutaArchivo: string): Promise<string[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(rutaArchivo);
    const worksheet = workbook.getWorksheet(1);
    const primeraFila = worksheet.getRow(1);
    const valores = Array.isArray(primeraFila.values)
      ? primeraFila.values.slice(1)
      : [];
    return valores.map(cell => (cell ? cell.toString().trim() : ''));
  }

  private async obtenerSharedStrings(rutaArchivo: string): Promise<string[]> {
    const sharedStrings: string[] = [];
    const stream = fs
      .createReadStream(rutaArchivo)
      .pipe(unzipper.Parse({ forceStream: true }));

    for await (const entry of stream) {
      if (entry.path === 'xl/sharedStrings.xml') {
        const saxStream = sax.createStream(true);
        let currentText = '';

        saxStream.on('opentag', node => {
          if (node.name === 't') {
            currentText = '';
          }
        });

        saxStream.on('text', text => {
          currentText += text;
        });

        saxStream.on('closetag', name => {
          if (name === 't') {
            sharedStrings.push(currentText);
          }
        });

        await new Promise((resolve, reject) => {
          saxStream.on('end', resolve);
          saxStream.on('error', reject);
          entry.pipe(saxStream);
        });
      } else {
        entry.autodrain();
      }
    }

    return sharedStrings;
  }

  public async procesarArchivoExcel(
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
      const encabezados: string[] = await this.obtenerEncabezados(rutaArchivo);
      const sharedStrings = await this.obtenerSharedStrings(rutaArchivo);
      console.log(`🟢 Encabezados detectados: ${JSON.stringify(encabezados)}`);

      let registrosProcesados = 0;
      let bloqueActual: any[] = [];
      let huboErrorFatal = false;

      const stream = fs
        .createReadStream(rutaArchivo)
        .pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of stream) {
        if (entry.path === 'xl/worksheets/sheet1.xml') {
          const saxStream = sax.createStream(true);
          let tempRowData: Record<number, string> = {};
          let currentColIndex = -1;
          let currentValue = '';
          let rowIndex = 0;
          let isSharedString = false;

          saxStream.on('opentag', node => {
            if (huboErrorFatal) return;

            if (node.name === 'row') {
              tempRowData = {};
              currentColIndex = -1;
              rowIndex++;
            }
            if (node.name === 'c') {
              const cell = node.attributes.r;
              const colLetter = cell.replace(/[0-9]/g, '');
              currentColIndex = this.colLetterToIndex(colLetter);
              isSharedString = node.attributes.t === 's';
            }
            if (node.name === 'v') {
              currentValue = '';
            }
          });

          saxStream.on('text', text => {
            if (!huboErrorFatal) currentValue += text;
          });

          saxStream.on('closetag', name => {
            if (huboErrorFatal) return;

            if (name === 'v') {
              let value = currentValue.trim();
              if (isSharedString) {
                const index = parseInt(value, 10);
                value = sharedStrings[index] || value;
              }
              tempRowData[currentColIndex] = value;
            }

            if (name === 'row' && rowIndex > 1) {
              const filaFinal: Record<string, string> = {};
              Object.keys(tempRowData).forEach(index => {
                const encabezado = encabezados[parseInt(index)];
                if (encabezado) {
                  filaFinal[encabezado] = tempRowData[parseInt(index)];
                }
              });

              if (Object.keys(filaFinal).length === 0) return;

              bloqueActual.push({
                cargaId: idCarga,
                fichaId: idCarga,
                datosJson: filaFinal
              });

              if (bloqueActual.length >= tamanoBloque) {
                entry.pause();
                const bloqueNumero =
                  Math.floor(registrosProcesados / tamanoBloque) + 1;
                const totalParcial = (
                  registrosProcesados + bloqueActual.length
                ).toLocaleString();

                console.log(
                  `📦 Procesando ${totalParcial} registros, bloque ${bloqueNumero.toLocaleString()} de ${tamanoBloque.toLocaleString()} registros`
                );

                RegistroExcelRepository.guardarRegistrosBulk(bloqueActual)
                  .then(async () => {
                    registrosProcesados += bloqueActual.length;
                    console.log(
                      `✅ Bloque ${bloqueNumero.toLocaleString()} guardado. Total acumulado: ${registrosProcesados.toLocaleString()} registros.`
                    );
                    await CargaRepository.actualizarCantidadRegistros(
                      idCarga,
                      registrosProcesados
                    );
                    bloqueActual = [];
                    if (!huboErrorFatal) entry.resume();
                  })
                  .catch(async error => {
                    console.error('❌ Error guardando bloque:', error);
                    huboErrorFatal = true;
                    await CargaService.actualizarEstadoCarga(
                      idCarga,
                      EEstadoCargaEnum.ERROR,
                      error.message
                    );
                    entry.destroy();
                  });
              }
            }
          });

          saxStream.on('end', async () => {
            if (huboErrorFatal) return;
            try {
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
                  `✅ Bloque final guardado. Total registros procesados: ${registrosProcesados.toLocaleString()}`
                );
              }
              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.CARGADO
              );
              console.log('🎉 Carga completada correctamente.');
            } catch (error) {
              console.error('❌ Error procesando bloque final:', error);
              await CargaService.actualizarEstadoCarga(
                idCarga,
                EEstadoCargaEnum.ERROR,
                error.message
              );
            }
          });

          saxStream.on('error', async error => {
            console.error('❌ Error en el parser SAX:', error);
            huboErrorFatal = true;
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

  public async obtenerRegistrosCarga(
    fichaId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    try {
      return await RegistroExcelRepository.obtenerDatosPorFicha(
        fichaId,
        page,
        limit
      );
    } catch (error) {
      throw error;
    }
  }
}
