import { QueryTypes } from 'sequelize';
import { Ficha } from '../model/ficha.model';
import { IStatus } from '../entity/backup.entity';

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
          "dateLastVersion",
          "dateRegister",
          "codigo",
          "familyCard",
          "personCard"
        )
      SELECT
        :usuarioCreacionId as usuario_creacion_id,
        (data::jsonb ->> 'version')::integer AS version,
        (data::jsonb ->> 'dateLastVersion')::timestamp  AS date_last_version,
        (data::jsonb ->> 'dateRegister')::timestamp  AS date_register,
        (data::jsonb ->> 'code')::integer AS codigo,
        (data::jsonb -> 'data' ->> 'familyCard')::JSON AS family_card,
        (data::jsonb -> 'data' ->> 'personCard')::JSON AS person_card
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
}
