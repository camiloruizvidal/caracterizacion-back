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
      this.workbook.xlsx.readFile(this.filePath);
      this.worksheet = this.workbook.getWorksheet(sheetName);
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
    if (!this.fileExists()) {
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
  }

  public async agregarDatos(data: any[]): Promise<void> {
    try {
      data.forEach(registro => {
        this.worksheet.addRow(registro);
      });
    } catch (error) {
      console.error({ error });
      throw error;
    }
    await this.guardar();
  }

  private async guardar(): Promise<void> {
    await this.workbook.xlsx.writeFile(this.filePath);
  }
}
