import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Config } from 'src/Config/Config';
import { CacheService } from './cache.service';
import { EFileStatus } from './global.interface';

export class WordAPdfService {
  private readonly carpetaSalida: string = path.join(
    Config.FOLDER_FILES_URL,
    Config.FOLDER_FILES_TEMPORAL
  );

  constructor() {
    this.crearCarpetaSiNoExiste(this.carpetaSalida);
  }

  public async generarPdf(
    nombrePlantilla: string,
    nombreArchivo: string,
    datos: Record<string, any>
  ): Promise<{ rutaCompleta: string; nombreArchivo: string }> {
    console.log('------------------------------------------------------------');
    CacheService.setFileStatus(
      `${Config.FOLDER_FILES_TEMPORAL}/${nombreArchivo}.pdf`,
      EFileStatus.IN_PROGRESS
    );
    console.log('************************************************************');
    const rutaPlantilla = path.join(
      Config.FOLDER_FILES_URL,
      Config.FOLDER_FILES_PLANTILLAS,
      nombrePlantilla
    );

    if (!fs.existsSync(rutaPlantilla)) {
      throw new Error(`La plantilla Word no se encontró: ${rutaPlantilla}`);
    }

    const rutaWordNuevo = path.join(
      this.carpetaSalida,
      `${nombreArchivo}.docx`
    );

    this.reemplazarMarcadoresEnWord(rutaPlantilla, rutaWordNuevo, datos);

    const rutaPdf = await this.convertirWordAPdf(rutaWordNuevo);
    CacheService.setFileStatus(
      `${Config.FOLDER_FILES_TEMPORAL}/${nombreArchivo}.pdf`,
      EFileStatus.COMPLETED
    );
    return rutaPdf;
  }

  private reemplazarMarcadoresEnWord(
    rutaPlantilla: string,
    rutaSalida: string,
    datos: Record<string, any>
  ): void {
    const contenidoPlantilla = fs.readFileSync(rutaPlantilla, 'binary');
    const zip = new PizZip(contenidoPlantilla);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    try {
      doc.render(datos);
      const buffer = doc.getZip().generate({ type: 'nodebuffer' });
      fs.writeFileSync(rutaSalida, buffer);
    } catch (error) {
      throw new Error(`Error al procesar la plantilla: ${error.message}`);
    }
  }

  public async convertirWordAPdf(
    rutaWord: string
  ): Promise<{ rutaCompleta: string; nombreArchivo: string }> {
    const nombreArchivo = `${path.basename(rutaWord, path.extname(rutaWord))}.pdf`;
    const rutaPdf = path.join(this.carpetaSalida, nombreArchivo);

    return new Promise((resolve, reject) => {
      const comandoLibreOffice = this.obtenerComandoLibreOffice(rutaWord);
      console.log('Ejecutando comando:', comandoLibreOffice);

      exec(comandoLibreOffice, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            `Error al convertir Word a PDF: ${stderr || error.message}`
          );
        }

        if (!fs.existsSync(rutaPdf)) {
          return reject('El archivo PDF no se generó correctamente.');
        }

        try {
          fs.unlinkSync(rutaWord);
          console.log(`Archivo Word eliminado: ${rutaWord}`);
        } catch (err) {
          console.warn(`No se pudo eliminar el archivo Word: ${err.message}`);
        }

        resolve({ rutaCompleta: rutaPdf, nombreArchivo });
      });
    });
  }

  private obtenerComandoLibreOffice(rutaWord: string): string {
    const comandoLibreOffice = Config.COMANDO_LIBREOFFICE;
    return `${comandoLibreOffice} --headless --convert-to pdf "${rutaWord}" --outdir "${this.carpetaSalida}"`;
  }

  private crearCarpetaSiNoExiste(rutaCarpeta: string): void {
    if (!fs.existsSync(rutaCarpeta)) {
      fs.mkdirSync(rutaCarpeta, { recursive: true });
    }
  }
}
