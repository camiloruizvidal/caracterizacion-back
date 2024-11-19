import { UserCodes } from '../model/user-codes.model';
import { User } from '../model/user.model';

export class UsuarioRepository {
  public static async buscarUsuarioConCodigos(
    usuario: string,
    inactivo: boolean = false
  ) {
    const user = await User.findOne({
      attributes: [
        'username',
        'password',
        'password',
        'nombrePrimero',
        'nombreSegundo',
        'apellidoPrimero',
        'apellidoSegundo',
        'documento',
        'rolId'
      ],
      where: {
        username: usuario,
        inactivo
      },
      include: [
        {
          model: UserCodes,
          attributes: ['start', 'finish']
        }
      ]
    });
    return user?.dataValues;
  }
}
