import { RegistroExcel } from '../model/registro-excel.model';
import { MapeoExcel } from '../model/mapeo-excel.model';
import { QueryTypes } from 'sequelize';

export class RegistroExcelRepository {
  public static async guardarRegistrosBulk(
    registros: {
      cargaId: number;
      fichaId: number;
      datosJson: any;
    }[]
  ): Promise<RegistroExcel[]> {
    try {
      return await RegistroExcel.bulkCreate(registros);
    } catch (error) {
      console.error('Error al guardar registros de Excel:', error);
      throw error;
    }
  }

  public static async obtenerDatosPorFicha(
    fichaId: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<{ count: number; totalPages: number; rows: any[] }> {
    const offset = (pagina - 1) * limite;
    const sequelize = RegistroExcel.sequelize;

    try {
      const mapeo = await MapeoExcel.findOne({
        where: { ficha_json_id: fichaId }
      });
      const columnas: string[] = mapeo?.columnas_excel ?? [];

      const camposSelect = columnas
        .map(campo => `datos_json ->> '${campo}' AS "${campo}"`)
        .join(',\n  ');

      const query = `
        SELECT
          id,
          carga_id,
          ficha_id,
          ${camposSelect}
        FROM registros_excel
        WHERE ficha_id = :fichaId
        LIMIT :limit OFFSET :offset
      `;

      const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM registros_excel
        WHERE ficha_id = :fichaId
      `;

      const [rows, countResult] = await Promise.all([
        sequelize.query(query, {
          replacements: { fichaId, limit: limite, offset },
          type: QueryTypes.SELECT
        }),
        sequelize.query(countQuery, {
          replacements: { fichaId },
          type: QueryTypes.SELECT
        })
      ]);

      const count = (countResult[0] as { total: number })?.total || 0;
      const totalPages = Math.ceil(count / limite);

      return {
        count,
        totalPages,
        rows
      };
    } catch (error) {
      throw error;
    }
  }
}
