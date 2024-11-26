import { Transformadores } from './../../../utils/helpers';
import sequelize, { Op } from 'sequelize';
import { UserCodes } from '../model/user-codes.model';
import { UserRoles } from '../model/user-roles.model';
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

  public static async buscarUsuariosPaginados(
    page: number,
    pageSize: number,
    rolId: number,
    buscar: string = ''
  ) {
    let where = {};

    if (buscar.trim() !== '') {
      where = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn(
              'LOWER',
              sequelize.fn('TRIM', sequelize.col('username'))
            ),
            {
              [Op.like]: `%${buscar}%`
            }
          ),
          sequelize.where(
            sequelize.fn(
              'LOWER',
              sequelize.fn('TRIM', sequelize.col('nombre_primero'))
            ),
            {
              [Op.like]: `%${buscar}%`
            }
          ),
          sequelize.where(
            sequelize.fn(
              'LOWER',
              sequelize.fn('TRIM', sequelize.col('nombre_segundo'))
            ),
            {
              [Op.like]: `%${buscar}%`
            }
          ),
          sequelize.where(
            sequelize.fn(
              'LOWER',
              sequelize.fn('TRIM', sequelize.col('apellido_primero'))
            ),
            {
              [Op.like]: `%${buscar}%`
            }
          ),
          sequelize.where(
            sequelize.fn(
              'LOWER',
              sequelize.fn('TRIM', sequelize.col('apellido_segundo'))
            ),
            {
              [Op.like]: `%${buscar}%`
            }
          ),
          sequelize.where(
            sequelize.fn(
              'LOWER',
              sequelize.fn('TRIM', sequelize.col('documento'))
            ),
            {
              [Op.like]: `%${buscar}%`
            }
          )
        ]
      };
    }

    if (rolId !== 0) {
      where['rolId'] = rolId;
    }

    const usuarios = await User.findAndCountAll({
      where,
      attributes: [
        'id',
        'nombrePrimero',
        'nombreSegundo',
        'apellidoPrimero',
        'apellidoSegundo',
        'documento',
        'inactivo'
      ],
      include: [{ model: UserRoles, attributes: ['id', 'type'] }]
    });
    return Transformadores.extraerDataValues(usuarios);
  }
}
