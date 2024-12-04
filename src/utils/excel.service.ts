import * as ExcelJS from 'exceljs';

export class ExcelService {
  private workbook: ExcelJS.Workbook;
  private worksheet: ExcelJS.Worksheet;

  constructor(sheetName: string) {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet(sheetName);
  }

  public agregarHeader(header: any[]): void {
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

  public agregarDatos(data: any[]): void {
    data.forEach(registro => {
      this.worksheet.addRow(registro);
    });
  }

  public async generarBuffer(): Promise<Buffer> {
    const arrayBuffer = await this.workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
