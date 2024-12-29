import { ETipoGrupo } from './../../../utils/global.interface';
import { Transformadores } from 'src/utils/helpers';
import { FichaJson } from '../model/ficha-json.model';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';

export class FichaJsonRepository {
  public static async obtenerFichaJsonPorVersion(version: number) {
    return await Transformadores.extraerDataValues(
      await FichaJson.findOne({ where: { version } })
    );
  }

  public static async obtenerFichaJson(version: number) {
    let values: any = await FichaJson.findOne({ where: { version } });

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

  public static async obtenerGruposFichaJson(
    version: number,
    tipo: 'grupal_data' | 'individual_data' = 'grupal_data'
  ) {
    const result = await FichaJson.sequelize.query(
      `SELECT
        (grupo->>'id')::INTEGER AS id,
        (grupo->>'orden')::INTEGER AS orden,
        grupo->>'title' AS title,
        grupo->>'subtitle' AS subtitle
      FROM (
        SELECT jsonb_array_elements(${tipo}) AS grupo
        FROM ficha_json
        WHERE version = :version
      ) subquery`,
      {
        type: QueryTypes.SELECT,
        replacements: { version }
      }
    );

    return result;
  }

  public static async insertarGrupoEnFichaJson(
    versionFicha: number,
    tipo: ETipoGrupo,
    title: string
  ) {
    const tipoData =
      tipo === ETipoGrupo.GRUPAL ? 'grupal_data' : 'individual_data';
    const result = await FichaJson.sequelize.query(
      `
      UPDATE ficha_json
      SET ${tipoData} = COALESCE(${tipoData}, '[]'::jsonb) || jsonb_build_object(
        'id', (
          SELECT COALESCE(MAX((elemento->>'id')::INTEGER), 0) + 1
          FROM (
            SELECT jsonb_array_elements(${tipoData}) AS elemento
            FROM ficha_json
          ) subquery
        ),
        'orden', (
          SELECT COALESCE(MAX((elemento->>'orden')::INTEGER), 0) + 1
          FROM (
            SELECT jsonb_array_elements(${tipoData}) AS elemento
            FROM ficha_json
            WHERE version = :versionFicha
          ) subquery2
        ),
        'table', NULL,
        'title', :title,
        'values', '[]'::jsonb,
        'subtitle', '',
        'createdAt', NOW(),
        'updatedAt', NOW()
      )::jsonb
      WHERE version = :versionFicha
      RETURNING ${tipoData};
      `,
      {
        replacements: {
          versionFicha,
          title: title
        },
        type: QueryTypes.UPDATE
      }
    );

    return result[0];
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
