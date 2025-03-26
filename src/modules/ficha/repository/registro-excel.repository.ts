import { RegistroExcel } from '../model/registro-excel.model';

export class RegistroExcelRepository {
  static async guardarRegistrosBulk(
    registros: {
      cargaId: number;
      fichaId: number;
      datosJson: any;
    }[]
  ): Promise<RegistroExcel[]> {
    try {
      return await RegistroExcel.bulkCreate(
        registros.map(registro => ({
          carga_id: registro.cargaId,
          ficha_id: registro.fichaId,
          datos_json: registro.datosJson
        }))
      );
    } catch (error) {
      console.error('Error al guardar registros de Excel:', error);
      throw error;
    }
  }
}
