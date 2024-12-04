import { Transformadores } from 'src/utils/helpers';
import { FichaJson } from '../model/ficha-json.model';

export class FichaJsonRepository {
  public static async obtenerFichaJson(idFicha: number) {
    let values: any = await FichaJson.findByPk(idFicha);
    if (!values) {
      values = {
        id: null,
        isFinish: false,
        version: null,
        dateLastVersion: new Date(),
        familyCard: [],
        personCard: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else {
      values = Transformadores.extraerDataValues(values);
    }
    return values;
  }
}
