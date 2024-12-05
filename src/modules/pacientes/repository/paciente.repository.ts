import {
  IPagination,
  ISearchPagination
} from './../../../utils/global.interface';
import { Transformadores } from 'src/utils/helpers';
import { Paciente } from '../model/paciente.model';

export class PacienteRepository {
  public static async guardarPacientesBulk(pacientes: any[]) {
    try {
      return await Paciente.bulkCreate(pacientes, {
        updateOnDuplicate: [
          'documentoTipo',
          'nombrePrimero',
          'nombreSegundo',
          'apellidoPrimero',
          'apellidoSegundo',
          'fechaNacimiento',
          'genero',
          'estadoCivil',
          'parentesco',
          'ocupacion',
          'aportaIngresos',
          'nivelEscolaridad',
          'tipoAfiliacionSalud',
          'grupoAtencionEspecial'
        ]
      });
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

    const resultado = Transformadores.extraerDataValues(
      await Paciente.findAndCountAll({
        offset,
        limit
      })
    );

    return {
      data: resultado.rows,
      totalItems: resultado.count,
      currentPage: page,
      totalPages: Math.ceil(resultado.count / pageSize),
      itemsPerPage: pageSize
    };
  }
}
