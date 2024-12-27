import { Transformadores } from 'src/utils/helpers';
import { FichaJson } from '../model/ficha-json.model';
import { Op } from 'sequelize';

export class FichaJsonRepository {
  public static async obtenerFichaJson(idFicha: number) {
    let values: any = await FichaJson.findByPk(idFicha);

    if (!values) {
      values = {
        id: null,
        isFinish: false,
        version: null,
        dateLastVersion: new Date(),
        grupalNombre: '',
        individualNombre: '',
        grupalData: [],
        individualData: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else {
      values = Transformadores.extraerDataValues(values);
      values.grupalData = values.grupalData || [];
      values.individualData = values.individualData || [];
    }

    return values;
  }

  public static async obtnerUltimaFichaActiva() {
    let values: any = await FichaJson.findOne({
      where: {
        isFinish: true
      },
      order: [['version', 'DESC']]
    });

    if (!values) {
      values = {
        id: null,
        isFinish: false,
        version: null,
        dateLastVersion: new Date(),
        grupalNombre: '',
        individualNombre: '',
        grupalData: [],
        individualData: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else {
      values = Transformadores.extraerDataValues(values);
      values.grupalData = values.grupalData || [];
      values.individualData = values.individualData || [];
    }

    return values;
  }

  public static async agregarFichaJson(data: {
    isFinish: any;
    version: any;
    dateLastVersion: any;
    grupalNombre: any;
    individualNombre: any;
  }) {
    return await FichaJson.create(data);
  }

  public static async actualizarFichaJson(
    idFichaJson: number,
    data: {
      isFinish: any;
      version: any;
      dateLastVersion: any;
      grupalNombre: any;
      individualNombre: any;
    }
  ) {
    return await FichaJson.update(data, { where: { id: idFichaJson } });
  }

  public static async obtenerXVersionFichaJson(version: string) {
    return await Transformadores.extraerDataValues(
      await FichaJson.findOne({ where: { version } })
    );
  }

  public static async verVersiones(isFinish: boolean = false) {
    return Transformadores.extraerDataValues(
      await FichaJson.findAll({
        attributes: ['nombre', 'version', 'grupalNombre', 'individualNombre'],
        where: { isFinish }
      })
    );
  }

  public static async verUltimaVersion(): Promise<number> {
    const version = (await FichaJson.max('version', {
      where: {
        version: { [Op.ne]: null }
      }
    })) as number | null;
    return version ?? 0;
  }

  public static async crearNuevaVersion(data: {
    nombre: string;
    grupalNombre: string;
    individualNombre: string;
  }) {
    const maxVersion = await FichaJsonRepository.verUltimaVersion();
    const nuevaVersion = maxVersion ? (Number(maxVersion) + 1).toString() : '1';
    return await FichaJson.create({
      ...data,
      version: nuevaVersion,
      isFinish: false,
      dateLastVersion: new Date(),
      grupalData: [],
      individualData: []
    });
  }
}
