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
      return await RegistroExcel.bulkCreate(registros);
    } catch (error) {
      console.error('Error al guardar registros de Excel:', error);
      throw error;
    }
  }
}
