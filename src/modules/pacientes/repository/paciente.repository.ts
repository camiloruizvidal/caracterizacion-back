import {
  IPagination,
  ISearchPagination
} from './../../../utils/global.interface';
import { Transformadores } from 'src/utils/helpers';

export class PacienteRepository {
  public static async guardarPacientesBulk(pacientes: any[]) {
    try {
      //TODOLa carga debe hacerse dinamica para cualquier tipo de persona, no solo con pacientes
    } catch (error) {
      console.error('Error al guardar o actualizar pacientes:', error);
      throw error;
    }
  }

  public static async verPacientesPaginado(
    parametros: ISearchPagination
  ): Promise<IPagination<any>> {
    const { page, pageSize } = parametros;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const resultado = Transformadores.extraerDataValues([]);

    return {
      data: resultado.rows,
      totalItems: resultado.count,
      currentPage: page,
      totalPages: Math.ceil(resultado.count / pageSize),
      itemsPerPage: pageSize
    };
  }
}
