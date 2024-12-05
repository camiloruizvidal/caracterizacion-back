import * as fs from 'fs';
import * as path from 'path';
import { Config } from 'src/Config/Config';

export class ArchivosService {
  private directorioBase: string = path.join(
    Config.FOLDER_FILES_URL,
    Config.FOLDER_FILES_TEMPORAL
  );

  constructor() {
    if (!fs.existsSync(this.directorioBase)) {
      fs.mkdirSync(this.directorioBase, { recursive: true });
    }
  }

  public guardarArchivo(file: Express.Multer.File): string {
    const nombre = `${new Date().getTime()}${file.originalname}.xlsx`;
    const rutaArchivo = path.join(this.directorioBase, nombre);

    try {
      fs.writeFileSync(rutaArchivo, file.buffer);
      console.log(`Archivo guardado en: ${rutaArchivo}`);
      return rutaArchivo;
    } catch (error) {
      console.error(`Error al guardar el archivo: ${error.message}`);
      throw new Error('No se pudo guardar el archivo');
    }
  }

  public eliminarArchivo(nombreArchivo: string): void {
    const rutaArchivo = path.join(this.directorioBase, nombreArchivo);

    try {
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
        console.log(`Archivo eliminado: ${rutaArchivo}`);
      } else {
        console.warn(`Archivo no encontrado para eliminar: ${rutaArchivo}`);
      }
    } catch (error) {
      console.error(`Error al eliminar el archivo: ${error.message}`);
      throw new Error('No se pudo eliminar el archivo');
    }
  }

  public listarArchivos(): string[] {
    try {
      return fs.readdirSync(this.directorioBase);
    } catch (error) {
      console.error(`Error al listar archivos: ${error.message}`);
      throw new Error('No se pudieron listar los archivos');
    }
  }
}
