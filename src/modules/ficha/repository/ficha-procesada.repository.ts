import { QueryTypes } from 'sequelize';
import { Ficha } from '../model/ficha.model';
import { IStatus } from './../../../utils/global.interface';
import { Transformadores } from 'src/utils/helpers';
import { FichaProcesada } from '../model/ficha-procesada.model';

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
}
