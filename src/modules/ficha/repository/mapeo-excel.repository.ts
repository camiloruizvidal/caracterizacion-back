import { IFormatoMapeoExcel } from '../interfaces/mapeo-excel.interface';
import { MapeoExcel } from '../model/mapeo-excel.model';

export class MapeoExcelRepository {
  public static async crear(mapeo: IFormatoMapeoExcel): Promise<void> {
    try {
      await MapeoExcel.create({
        ficha_json_id: mapeo.fichaJsonId,
        columnas_excel: mapeo.columnasExcel,
        mapeo: mapeo.mapeo
      });
    } catch (error) {
      throw new Error('Error al crear el mapeo de Excel: ' + error.message);
    }
  }

  public static async actualizar(
    fichaJsonId: number,
    mapeo: IFormatoMapeoExcel
  ): Promise<void> {
    try {
      await MapeoExcel.update(
        {
          columnas_excel: mapeo.columnasExcel,
          mapeo: mapeo.mapeo
        },
        {
          where: { ficha_json_id: fichaJsonId }
        }
      );
    } catch (error) {
      throw new Error(
        'Error al actualizar el mapeo de Excel: ' + error.message
      );
    }
  }

  public static async obtenerPorFicha(
    fichaJsonId: number
  ): Promise<MapeoExcel | null> {
    try {
      return await MapeoExcel.findOne({
        where: { ficha_json_id: fichaJsonId }
      });
    } catch (error) {
      throw new Error('Error al obtener el mapeo de Excel: ' + error.message);
    }
  }

  public static async obtenerEncabezadosPorFicha(
    fichaJsonId: number
  ): Promise<IFormatoMapeoExcel> {
    try {
      const mapeo = await MapeoExcel.findOne({
        where: { ficha_json_id: fichaJsonId }
      });

      if (!mapeo) {
        throw new Error('No se encontró el mapeo para la ficha especificada');
      }

      return {
        fichaJsonId: mapeo.ficha_json_id,
        columnasExcel: mapeo.columnas_excel,
        mapeo: mapeo.mapeo
      };
    } catch (error) {
      throw new Error('Error al obtener los encabezados: ' + error.message);
    }
  }
}
