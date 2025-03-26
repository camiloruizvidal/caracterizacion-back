import { RegistroExcel } from '../model/registro-excel.model';
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
    campos: string[],
    pagina: number = 1,
    limite: number = 10
  ): Promise<any[]> {
    const offset = (pagina - 1) * limite;

    const camposSelect = campos
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

    const sequelize = RegistroExcel.sequelize;

    try {
      return await sequelize.query(query, {
        replacements: {
          cargaId,
          limit: limite,
          offset
        },
        type: QueryTypes.SELECT
      });
    } catch (error) {
      throw error;
    }
  }
}
