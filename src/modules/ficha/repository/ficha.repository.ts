import { Paciente } from './../../pacientes/model/paciente.model';
import { Op } from 'sequelize';
import { Ficha } from '../model/ficha.model';
import { TarjetaFamiliar } from '../model/tarjeta-familiar.model';
import { PsicosocialPersona } from '../model/psicosocial-persona.model';
import { Transformadores } from 'src/utils/helpers';

export class FichaRepository {
  public static async cargarFichaPaginada(filtros: {
    fechaInicio: string;
    fechaFin: string;
    usuarioId: string;
    municipio: string;
    page: number;
    pageSize: number;
  }): Promise<{
    data: any[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  }> {
    const { fechaInicio, fechaFin, usuarioId, page, pageSize } = filtros;

    const whereConditions: any = {};
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    if (fechaInicio && fechaInicio.trim() !== '') {
      whereConditions.fechaRegistro = {
        [Op.gte]: new Date(fechaInicio)
      };
    }

    if (fechaFin && fechaFin.trim() !== '') {
      whereConditions.fechaRegistro = {
        ...(whereConditions.fechaRegistro || {}),
        [Op.lte]: new Date(fechaFin)
      };
    }

    if (usuarioId && usuarioId.trim() !== '') {
      whereConditions.usuarioCreacionId = usuarioId;
    }

    const { rows: items, count: totalItems } = await Ficha.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: TarjetaFamiliar,
          as: 'tarjetasFamiliares'
        },
        {
          model: PsicosocialPersona,
          as: 'psicosocialPersonas',
          include: [
            {
              model: Paciente,
              as: 'persona'
            }
          ]
        }
      ],
      order: [
        ['codigo', 'DESC'],
        ['fechaRegistro', 'ASC']
      ],
      offset,
      limit
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: Transformadores.extraerDataValues(items),
      totalItems,
      currentPage: page,
      totalPages,
      itemsPerPage: pageSize
    };
  }

  public static async crearFicha(
    userId: number,
    version: number,
    code: number,
    dateRegister: Date
  ): Promise<Ficha> {
    const fichaCreada = await Ficha.create({
      usuarioCreacionId: userId,
      version: version,
      codigo: code,
      fechaRegistro: dateRegister
    });

    return Transformadores.extraerDataValues(fichaCreada);
  }

  public static async obtenerFicha(): Promise<any[]> {
    return Transformadores.extraerDataValues(
      await Ficha.findAll({
        order: [['orden', 'ASC']]
      })
    );
  }
}
