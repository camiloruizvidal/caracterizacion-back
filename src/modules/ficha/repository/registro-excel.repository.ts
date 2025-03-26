import { RegistroExcel } from '../model/registro-excel.model';
import { Carga } from '../model/carga.model';
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

  public static async obtenerDatosPorCarga(
    cargaId: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<{ count: number; totalPages: number; rows: any[] }> {
    const offset = (pagina - 1) * limite;
    const sequelize = RegistroExcel.sequelize;

    try {
      const carga = await Carga.findByPk(cargaId);
      const fichaId = carga?.fichaId;
      if (!fichaId) throw new Error('Ficha no encontrada para la carga.');

      const mapeo = await MapeoExcel.findOne({
        where: { ficha_json_id: fichaId }
      });
      const columnas: string[] = mapeo?.columnas_excel;

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
        WHERE carga_id = :cargaId
        LIMIT :limit OFFSET :offset
      `;

      const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM registros_excel
        WHERE carga_id = :cargaId
      `;

      const [rows, countResult] = await Promise.all([
        sequelize.query(query, {
          replacements: { cargaId, limit: limite, offset },
          type: QueryTypes.SELECT
        }),
        sequelize.query(countQuery, {
          replacements: { cargaId },
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
