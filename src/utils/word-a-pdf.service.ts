import * as fs from 'fs';
import * as path from 'path';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import { Config } from 'src/Config/Config';

export class WordAPdfService {
  private outputDir: string = path.join(
    Config.FOLDER_FILES_URL,
    Config.FOLDER_FILES_TEMPORAL
  );

  constructor() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  public async generarPdf(
    wordFilePath: string,
    datos: Record<string, any> | Record<string, any>[]
  ): Promise<string> {
    wordFilePath = path.join(
      Config.FOLDER_FILES_URL,
      Config.FOLDER_FILES_PLANTILLAS,
      wordFilePath
    );

    if (!fs.existsSync(wordFilePath)) {
      throw new Error(`El archivo Word no se encontró: ${wordFilePath}`);
    }

    const wordContent = fs.readFileSync(wordFilePath);
    const htmlContent = await this.convertirWordAHtml(wordContent);

    const htmlConDatos = this.reemplazarMarcadores(htmlContent, datos);

    const pdfPath = path.join(this.outputDir, 'documento-generado.pdf');
    await this.convertirHtmlAPdf(htmlConDatos, pdfPath);

    return pdfPath;
  }

  private async convertirWordAHtml(buffer: Buffer): Promise<string> {
    const { value: html } = await mammoth.convertToHtml({ buffer });
    return html;
  }

  private reemplazarMarcadores(
    html: string,
    datos: Record<string, any> | Record<string, any>[]
  ): string {
    let htmlConDatos = html;
    const datosCompletos = Array.isArray(datos) ? { tabla: datos } : datos;

    Object.keys(datosCompletos).forEach(key => {
      const valor = datosCompletos[key];
      if (Array.isArray(valor)) {
      } else {
        htmlConDatos = htmlConDatos.replace(
          new RegExp(`{{${key}}}`, 'g'),
          valor
        );
      }
    });

    return htmlConDatos;
  }

  private async convertirHtmlAPdf(html: string, outputPath: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(html);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
  }
}
