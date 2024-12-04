import { Config } from 'src/Config/Config';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

export class ExcelService {
  private workbook: ExcelJS.Workbook;
  private worksheet: ExcelJS.Worksheet;
  private filePath: string;

  constructor(fileName: string = 'reporte', sheetName: string = 'Hoja 1') {
    const ruta = `${Config.FILE_URL}\\${fileName}.xlsx`;
    this.filePath = path.resolve(ruta);
    this.workbook = new ExcelJS.Workbook();
    if (this.fileExists()) {
      this.workbook.xlsx
        .readFile(this.filePath)
        .then(() => {
          this.worksheet = this.workbook.getWorksheet(sheetName);
          if (!this.worksheet) {
            this.worksheet = this.workbook.addWorksheet(sheetName);
          }
        })
        .catch(error => {
          console.error(`Error al leer el archivo Excel: ${error.message}`);
          throw error;
        });
    } else {
      this.worksheet = this.workbook.addWorksheet(sheetName);
    }
  }

  public getFilePath(): string {
    return this.filePath;
  }

  private fileExists(): boolean {
    return fs.existsSync(this.filePath);
  }

  public agregarHeader(header: any[]): void {
    console.log(this.worksheet?.getRow(1)?.actualCellCount);
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

  public async agregarDatos(data: any[]): Promise<void> {
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
    await this.guardar();
  }

  private async guardar(): Promise<void> {
    try {
      await this.workbook.xlsx.writeFile(this.filePath);
    } catch (error) {
      console.error(`Error al guardar el archivo: ${error.message}`);
      throw error;
    }
  }
}
