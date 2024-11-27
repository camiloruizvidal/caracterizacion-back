import { Transformadores } from 'src/utils/helpers';
import { FichaTipo } from '../model/ficha-tipo.model';

export class FichaTipoRepository {
  public static async obtenerTiposFichas() {
    return Transformadores.extraerDataValues(await FichaTipo.findAll());
  }
}
