import { Transformadores } from 'src/utils/helpers';
import { FichaDescripcion } from '../model/ficha-descripcion.model';

export class FichaDescripcionRepository {
  public static async obtenerFichasDescripcion(): Promise<any[]> {
    return Transformadores.extraerDataValues(
      await FichaDescripcion.findAll({
        order: [['orden', 'ASC']]
      })
    );
  }
}
