import { Transformadores } from 'src/utils/helpers';
import { FichaGrupo } from '../model/ficha-grupo.model';

export class FichaGrupoRepository {
  public static async obtenerGrupos(): Promise<any[]> {
    return Transformadores.extraerDataValues(
      await FichaGrupo.findAll({
        order: [['orden', 'ASC']]
      })
    );
  }
}
