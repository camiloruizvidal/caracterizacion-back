import { Transformadores } from 'src/utils/helpers';
import {
  EEstadoGeneracionExcel,
  GeneracionExcel
} from '../models/generacion-excel.model';

export class GeneracionExcelRepository {
  public static async crearProgreso(
    version: number,
    rutaArchivo: string,
    totalRegistros: number
  ): Promise<GeneracionExcel> {
    return await GeneracionExcel.create({
      version,
      rutaArchivo,
      totalRegistros,
      estado: EEstadoGeneracionExcel.EN_PROCESO,
      registrosProcesados: 0
    });
  }

  public static async actualizarProgreso(
    id: number,
    registrosProcesados: number
  ): Promise<void> {
    await GeneracionExcel.update({ registrosProcesados }, { where: { id } });
  }

  public static async marcarComoCompletado(id: number): Promise<void> {
    await GeneracionExcel.update(
      {
        estado: EEstadoGeneracionExcel.COMPLETADO,
        fechaFin: new Date()
      },
      { where: { id } }
    );
  }

  public static async marcarComoError(
    id: number,
    mensajeError: string
  ): Promise<void> {
    await GeneracionExcel.update(
      {
        estado: EEstadoGeneracionExcel.ERROR,
        fechaFin: new Date(),
        mensajeError
      },
      { where: { id } }
    );
  }

  public static async obtenerProgreso(id: number) {
    return await Transformadores.extraerDataValues(
      await GeneracionExcel.findOne({ where: { id } })
    );
  }

  public static async obtenerProgresoPorVersion(version: number) {
    return await Transformadores.extraerDataValues(
      await GeneracionExcel.findOne({
        where: { version },
        order: [['id', 'DESC']]
      })
    );
  }

  public static async obtenerPorRutaArchivo(
    rutaArchivo: string
  ): Promise<GeneracionExcel | null> {
    return await GeneracionExcel.findOne({
      where: { rutaArchivo }
    });
  }
}
