import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WordToPdfService {
  async convertir(wordFilePath: string, outputDir: string): Promise<string> {
    const pdfFilePath = path.join(
      outputDir,
      `${path.basename(wordFilePath, path.extname(wordFilePath))}.pdf`
    );
    console.log({ pdfFilePath });
    return new Promise((resolve, reject) => {
      const command = `/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf "${wordFilePath}" --outdir "${outputDir}"`;
      console.log({ command });
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(
            `Error al convertir el archivo: ${stderr || error.message}`
          );
        }

        if (!fs.existsSync(pdfFilePath)) {
          return reject('El archivo PDF no se generó correctamente.');
        }

        resolve(pdfFilePath);
      });
    });
  }
}
