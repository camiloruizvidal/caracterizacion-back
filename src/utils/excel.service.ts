import { Config } from 'src/Config/Config';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import path from 'path';
import { CacheService } from './cache.service';
import { EFileStatus } from './global.interface';

export class ExcelService {
  private workbook: ExcelJS.Workbook;
  private worksheet: ExcelJS.Worksheet | null = null;
  private filePath: string = '';
  private fileName: string = '';
  private chunkSize: number = 100;

  constructor() {}

  public async iniciarEscritura(
    fileName: string = 'archivo excel',
    sheetName: string = 'Hoja 1'
  ): Promise<void> {
    this.worksheet = null;
    this.workbook = new ExcelJS.Workbook();
    this.fileName = fileName;
    CacheService.setFileStatus(this.fileName, EFileStatus.IN_PROGRESS);
    const ruta = `${Config.FOLDER_FILES_URL}\\${this.fileName}`;
    this.filePath = path.resolve(ruta);
    if (this.fileExists()) {
      try {
        await this.workbook.xlsx.readFile(this.filePath);
        this.worksheet = this.workbook.getWorksheet(sheetName);
        if (!this.worksheet) {
          this.worksheet = this.workbook.addWorksheet(sheetName);
        }
      } catch (error) {
        console.error(`Error al leer el archivo Excel: ${error.message}`);
        throw error;
      }
    } else {
      this.worksheet = this.workbook.addWorksheet(sheetName);
    }
  }

  public finalizarEscritura(): void {
    CacheService.setFileStatus(this.fileName, EFileStatus.COMPLETED);
    const status = CacheService.getFileStatus(this.fileName);
    if (status !== EFileStatus.COMPLETED) {
      throw new Error(
        `El archivo aún está en estado "${status}". Espere a que finalice.`
      );
    }
  }

  public agregarHeaderEscritura(header: any[]): void {
    if (this.fileExists() && this.worksheet?.getRow(1)?.actualCellCount > 0) {
      return;
    }

    let currentColumn = 1;

    const headers = header[0];
    headers.forEach(row => {
      const startColumn = currentColumn;
      const endColumn = startColumn + row.colSpan - 1;
      this.worksheet.mergeCells(1, startColumn, 1, endColumn);
      const cell = this.worksheet.getCell(1, startColumn);
      cell.value = row.value;
      cell.alignment = { horizontal: 'center' };

      currentColumn = endColumn + 1;
    });

    this.worksheet.addRow(header[1]);
  }

  public async agregarDatosEscritura(data: any[]): Promise<void> {
    if (!this.worksheet) {
      throw new Error(
        'Worksheet no inicializado. Verifica el nombre de la hoja.'
      );
    }

    try {
      data.forEach(registro => {
        this.worksheet.addRow(registro);
      });
    } catch (error) {
      console.error(`Error al agregar datos: ${error.message}`);
      throw error;
    }
    await this.guardarEscrituraEnArchivo();
  }

  private async guardarEscrituraEnArchivo(): Promise<void> {
    try {
      await this.workbook.xlsx.writeFile(this.filePath);
    } catch (error) {
      console.error(`Error al guardar el archivo: ${error.message}`);
      throw error;
    }
  }

  public async iniciarLectura(
    fileName: string,
    chunkSize: number = 100
  ): Promise<void> {
    this.worksheet = null;
    this.workbook = new ExcelJS.Workbook();
    this.fileName = fileName;
    this.chunkSize = chunkSize;
    const ruta = path.join(this.fileName);
    this.filePath = path.resolve(ruta);

    if (!fs.existsSync(this.filePath)) {
      throw new Error('El archivo no existe.');
    }
  }

  public async obtenerRegistrosXGrupos(grupo: number): Promise<any[]> {
    if (!this.filePath) {
      throw new Error(
        'Archivo no inicializado. Llama a iniciarLectura primero.'
      );
    }

    const inicio = grupo * this.chunkSize + 2; // Comienza en la fila correspondiente al grupo
    const fin = inicio + this.chunkSize - 1;
    const registros: any[] = [];
    let headers: string[] = [];
    let currentRow = 0;

    const stream = fs.createReadStream(this.filePath);
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
      entries: 'emit',
      worksheets: 'emit',
      styles: 'cache',
      sharedStrings: 'cache'
    });

    for await (const worksheet of workbookReader) {
      let headerProcessed = false;

      for await (const row of worksheet) {
        currentRow++;

        if (currentRow === 1 && !headerProcessed) {
          headers = Array.isArray(row.values)
            ? (row.values.slice(1) as string[])
            : [];
          headerProcessed = true;
          continue;
        }

        if (currentRow >= inicio && currentRow <= fin) {
          const rowData = Array.isArray(row.values) ? row.values.slice(1) : [];
          const registro: any = {};
          headers.forEach((header, index) => {
            registro[header] = rowData[index] ?? null;
          });
          registros.push(registro);
        }

        if (currentRow > fin) {
          return registros;
        }
      }
    }

    return registros;
  }

  public async obtenerTotalRegistros(): Promise<number> {
    if (!this.filePath) {
      throw new Error(
        'Archivo no inicializado. Llama a iniciarLectura primero.'
      );
    }

    const stream = fs.createReadStream(this.filePath);
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
      entries: 'emit',
      worksheets: 'emit',
      styles: 'cache',
      sharedStrings: 'cache'
    });

    let totalRows = 0;
    let primeraHojaProcesada = false;

    for await (const worksheet of workbookReader) {
      if (!primeraHojaProcesada) {
        primeraHojaProcesada = true;

        for await (const row of worksheet) {
          totalRows++;
        }

        break;
      }
    }

    return totalRows > 1 ? totalRows - 1 : 0;
  }

  private fileExists(): boolean {
    return fs.existsSync(this.filePath);
  }
}
