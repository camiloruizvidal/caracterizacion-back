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
    const respueta = await GeneracionExcel.findOne({
      where: { rutaArchivo }
    });
    return respueta.dataValues;
  }

  public static async obtenerRegistrosPaginados(
    page: number = 1,
    pageSize: number = 10,
    versionId?: number
  ) {
    const offset = (page - 1) * pageSize;
    const whereClause = versionId ? { version: versionId } : {};

    const { count, rows } = await GeneracionExcel.findAndCountAll({
      where: whereClause,
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']]
    });

    return {
      data: rows.map(row => row.dataValues),
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
      itemsPerPage: pageSize
    };
  }
}
