import { Transformadores } from './../../../utils/helpers';
import { DocumentoTipo } from '../model/documento-tipo.model';

export class DocumentoTipoRepository {
  private static cache: any[] | null = null;
  private static lastFetch: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

  public static async cargarDocumentosTipos() {
    const now = Date.now();

    // Si hay caché y no ha expirado, devolver el caché
    if (this.cache && now - this.lastFetch < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      // Obtener solo los campos necesarios
      const documentos = await DocumentoTipo.findAll({
        attributes: ['id', 'prefijo', 'tipoDocumento', 'nombre'],
        order: [['id', 'ASC']]
      });

      const result = Transformadores.extraerDataValues(documentos);

      // Actualizar caché
      this.cache = result;
      this.lastFetch = now;

      return result;
    } catch (error) {
      console.error('Error al cargar tipos de documento:', error);
      throw error;
    }
  }
}
