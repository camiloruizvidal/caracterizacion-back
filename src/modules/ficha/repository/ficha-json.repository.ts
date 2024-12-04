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

  public static async agregarFichaJson(data: {
    isFinish: any;
    version: any;
    dateLastVersion: any;
    familyCard: any;
    personCard: any;
  }) {
    return await FichaJson.create(data);
  }

  public static async actualizarFichaJson(
    idFichaJson: number,
    data: {
      isFinish: any;
      version: any;
      dateLastVersion: any;
      familyCard: any;
      personCard: any;
    }
  ) {
    return await FichaJson.update(data, { where: { id: idFichaJson } });
  }

  public static async obtenerXVersionFichaJson(version: string) {
    return await Transformadores.extraerDataValues(
      await FichaJson.findOne({ where: { version } })
    );
  }
}
