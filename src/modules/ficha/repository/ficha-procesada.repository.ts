import { QueryTypes } from 'sequelize';
import { Ficha } from '../model/ficha.model';
import { IStatus } from './../../../utils/global.interface';
import { Transformadores } from 'src/utils/helpers';
import { FichaProcesada } from '../model/ficha-procesada.model';

interface ICountResult {
  total: string;
}

export class FichaProcesadaRepository {
  public static async procesarBackupsAlmacenadas(
    usuarioCreacionId: number,
    version: number = 0
  ) {
    const sequelize = Ficha.sequelize;
    let transaction;
    const almacenado = IStatus.Almacenado;
    const guardado = IStatus.Guardado;
    const replacements = { almacenado, usuarioCreacionId, guardado };
    let whereVersion = '';

    if (version !== 0) {
      replacements['version'] = version;
      whereVersion = "AND (data::jsonb ->> 'version')::integer = :version ";
    }

    const sql = `INSERT INTO
        ficha_procesada (
          "usuario_creacion_id",
          "version",
          "date_last_version",
          "date_register",
          "codigo",
          "grupal_data",
          "individual_data"
        )
      SELECT
        :usuarioCreacionId as usuario_creacion_id,
        (data::jsonb ->> 'version')::integer AS version,
        (data::jsonb ->> 'dateLastVersion')::timestamp  AS date_last_version,
        (data::jsonb ->> 'dateRegister')::timestamp  AS date_register,
        (data::jsonb ->> 'code')::integer AS codigo,
        (data::jsonb -> 'data' ->> 'grupalData')::JSON AS grupal_data,
        (data::jsonb -> 'data' ->> 'individualData')::JSON AS individual_data
      FROM backup
      WHERE
        backup.status = :almacenado ${whereVersion}
      ORDER BY 4;
      UPDATE
        backup
      SET
        status = :guardado
      WHERE
        status = :almacenado;
    `;
    try {
      transaction = await sequelize.transaction();

      await sequelize.query(sql, {
        replacements,
        type: QueryTypes.INSERT,
        transaction
      });
      await transaction.commit();
    } catch (error) {
      console.error({ error });
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  public static async obtenerFichasProcesadas(
    pagina: number = 1,
    registrosXPagina: number = 10
  ) {
    const offset = (pagina - 1) * registrosXPagina;
    const limit = registrosXPagina;

    const { count, rows } = await FichaProcesada.findAndCountAll({
      limit,
      offset
    });

    return Transformadores.extraerDataValues({
      rows,
      totalRegistros: count,
      registrosXPagina: limit,
      totalPaginas: Math.ceil(count / registrosXPagina),
      paginaActual: pagina
    });
  }

  public static async obtenerEstadisticasPorCaracterizador(
    caracterizadorId?: number,
    fichaVersion?: number,
    pagina: number = 1,
    registrosPorPagina: number = 10
  ) {
    const sequelize = FichaProcesada.sequelize;
    let whereClause = '';
    const replacements: any = {};
    const offset = (pagina - 1) * registrosPorPagina;

    if (caracterizadorId) {
      whereClause +=
        ' AND ficha_procesada.usuario_creacion_id = :caracterizadorId';
      replacements.caracterizadorId = caracterizadorId;
    }

    if (fichaVersion) {
      whereClause += ' AND ficha_procesada.version = :fichaVersion';
      replacements.fichaVersion = fichaVersion;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT
          "user".id,
          ficha_procesada.version,
          TO_CHAR(DATE_TRUNC('month', ficha_procesada.date_register), 'YYYY-MM') as mes
        FROM ficha_procesada
        INNER JOIN "user" ON "user".id = ficha_procesada.usuario_creacion_id
        INNER JOIN ficha_json ON ficha_json.version::integer = ficha_procesada.version
        WHERE 1=1 ${whereClause}
        GROUP BY
          "user".id,
          ficha_procesada.version,
          TO_CHAR(DATE_TRUNC('month', ficha_procesada.date_register), 'YYYY-MM')
      ) as subquery
    `;

    const dataQuery = `
      SELECT
        "user".id as caracterizador_id,
        CONCAT("user".nombre_primero, ' ', "user".nombre_segundo, ' ', "user".apellido_primero, ' ', "user".apellido_segundo) as caracterizador_nombre,
        "user".documento as caracterizador_documento,
        ficha_json.nombre as ficha_nombre,
        ficha_procesada.version as ficha_version,
        TO_CHAR(DATE_TRUNC('month', ficha_procesada.date_register), 'YYYY-MM') as mes,
        COUNT(*) as total_fichas
      FROM ficha_procesada
      INNER JOIN "user" ON "user".id = ficha_procesada.usuario_creacion_id
      INNER JOIN ficha_json ON ficha_json.version::integer = ficha_procesada.version
      WHERE 1=1 ${whereClause}
      GROUP BY
        "user".id,
        CONCAT("user".nombre_primero, ' ', "user".nombre_segundo, ' ', "user".apellido_primero, ' ', "user".apellido_segundo),
        "user".documento,
        ficha_json.nombre,
        ficha_procesada.version,
        TO_CHAR(DATE_TRUNC('month', ficha_procesada.date_register), 'YYYY-MM')
      ORDER BY
        "user".id,
        ficha_procesada.version,
        TO_CHAR(DATE_TRUNC('month', ficha_procesada.date_register), 'YYYY-MM') DESC
      LIMIT :limit OFFSET :offset
    `;

    replacements.limit = registrosPorPagina;
    replacements.offset = offset;

    const [countResult, rows] = await Promise.all([
      sequelize.query<ICountResult>(countQuery, {
        replacements,
        type: QueryTypes.SELECT
      }),
      sequelize.query(dataQuery, {
        replacements,
        type: QueryTypes.SELECT
      })
    ]);

    const total = parseInt(countResult[0].total);
    const totalPages = Math.ceil(total / registrosPorPagina);

    return {
      count: total,
      totalPages,
      rows
    };
  }

  public static async obtenerFichasProcesadasConCamposDinamicos(
    version: number,
    limit: number = 10,
    offset: number = 0
  ) {
    const query = `
      WITH ficha_json_data AS (
        SELECT 
          jsonb_array_elements(grupal_data) as grupo_grupal,
          jsonb_array_elements(individual_data) as grupo_individual
        FROM ficha_json 
        WHERE version = :version
      ),
      columnas_grupal AS (
        SELECT DISTINCT
          valor->>'columnName' as column_name,
          valor->>'label' as label
        FROM ficha_json_data,
        jsonb_array_elements(grupo_grupal->'values') as valor
        WHERE valor->>'columnName' IS NOT NULL
      ),
      columnas_individual AS (
        SELECT DISTINCT
          valor->>'columnName' as column_name,
          valor->>'label' as label
        FROM ficha_json_data,
        jsonb_array_elements(grupo_individual->'values') as valor
        WHERE valor->>'columnName' IS NOT NULL
      ),
      ficha_procesada_data AS (
        SELECT 
          fp.id,
          fp.codigo,
          fp.date_register,
          u.nombre_primero || ' ' || u.nombre_segundo || ' ' || u.apellido_primero || ' ' || u.apellido_segundo as caracterizador_nombre,
          u.documento as caracterizador_documento,
          ${this.generarCamposDinamicos('grupal')},
          ${this.generarCamposDinamicos('individual')}
        FROM ficha_procesada fp
        INNER JOIN "user" u ON u.id = fp.usuario_creacion_id
        WHERE fp.version = :version
        LIMIT :limit OFFSET :offset
      )
      SELECT * FROM ficha_procesada_data;
    `;

    return await FichaProcesada.sequelize.query(query, {
      replacements: { version, limit, offset },
      type: QueryTypes.SELECT
    });
  }

  private static generarCamposDinamicos(tipo: 'grupal' | 'individual'): string {
    const query = `
      SELECT string_agg(
        format(
          'MAX(CASE WHEN v->>''columnName'' = ''%s'' THEN v->>''value'' END) as %s',
          column_name,
          column_name
        ),
        ', '
      ) as campos
      FROM ${tipo === 'grupal' ? 'columnas_grupal' : 'columnas_individual'}
    `;

    const result = FichaProcesada.sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    return result[0]?.campos || '';
  }
}
