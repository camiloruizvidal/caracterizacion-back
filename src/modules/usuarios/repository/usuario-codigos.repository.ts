import { Transformadores } from 'src/utils/helpers';
import { UserCodes } from '../model/user-codes.model';

export class UsuarioCodigosRepository {
  public static async asignarCodigo(
    start: number,
    finish: number,
    userId: number
  ) {
    return Transformadores.extraerDataValues(
      await UserCodes.create({
        start,
        finish,
        userId
      })
    );
  }

  public static async verCodigosPorUsuario(usuarioId: number) {
    return Transformadores.extraerDataValues(
      await UserCodes.findAll({
        attributes: ['start', 'finish'],
        where: { userId: usuarioId },
        order: ['start']
      })
    );
  }
}
