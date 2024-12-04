import { Transformadores } from 'src/utils/helpers';
import { FichaGrupo } from '../model/ficha-grupo.model';

export class FichaGrupoRepository {
  public static async obtenerGrupos(): Promise<any[]> {
    return Transformadores.extraerDataValues(
      await FichaGrupo.findAll({
        attributes: ['id', 'title', 'subtitle', 'ficha_tipo_id', 'orden'],
        order: [['orden', 'ASC']]
      })
    );
  }
  public static async guardarNuevoGrupo(data: {
    ficha_tipo_id: number;
    title: string;
  }) {
    return await FichaGrupo.create(data);
  }
}
