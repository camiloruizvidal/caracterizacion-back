import { FichaProcesada } from '../model/ficha-procesada.model';
import { Ficha } from '../model/ficha.model';
import { Transformadores } from 'src/utils/helpers';
import { User } from '../../usuarios/model/user.model';

export class FichaRepository {
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

  public static async obtenerFicha(id: number): Promise<any[]> {
    return Transformadores.extraerDataValues(
      await Ficha.findOne({ where: { id } })
    );
  }

  public static async obtenerEncuestasProcesadas(
    version: number,
    limit: number = 10,
    offset: number = 0
  ) {
    return Transformadores.extraerDataValues(
      await FichaProcesada.findAll({
        where: { version },
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: [
              'id',
              'nombrePrimero',
              'nombreSegundo',
              'apellidoPrimero',
              'apellidoSegundo',
              'documento'
            ]
          }
        ]
      })
    );
  }
}
