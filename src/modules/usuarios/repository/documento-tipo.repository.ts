import { Transformadores } from './../../../utils/helpers';
import { DocumentoTipo } from '../model/documento-tipo.model';

export class DocumentoTipoRepository {
  public static async cargarDocumentosTipos() {
    return Transformadores.extraerDataValues(await DocumentoTipo.findAll());
  }
}
