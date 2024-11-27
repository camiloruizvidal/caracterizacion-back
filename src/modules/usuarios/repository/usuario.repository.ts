import { Ficha } from './../../ficha/model/ficha.model';
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

    const offset = (page - 1) * pageSize;

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
      include: [{ model: UserRoles, attributes: ['id', 'type'] }],
      limit: pageSize,
      offset
    });
    return Transformadores.extraerDataValues(usuarios);
  }

  public static async crearUsuario(usuario: {
    username: string;
    password: string;
    nombrePrimero: string;
    nombreSegundo?: string;
    apellidoPrimero: string;
    apellidoSegundo?: string;
    documento: string;
    documentoTipoId: string;
    rolId: string;
    inactivo: boolean;
  }) {
    return Transformadores.extraerDataValues(
      await User.create({
        username: usuario.username,
        password: usuario.password,
        nombrePrimero: usuario.nombrePrimero,
        nombreSegundo: usuario.nombreSegundo || null,
        apellidoPrimero: usuario.apellidoPrimero,
        apellidoSegundo: usuario.apellidoSegundo || null,
        documento: usuario.documento,
        documentoTipoId: Number(usuario.documentoTipoId),
        rolId: Number(usuario.rolId),
        inactivo: usuario.inactivo
      })
    );
  }

  public static async buscarPorDocumento(documento: string): Promise<any> {
    return Transformadores.extraerDataValues(
      await User.findOne({
        where: { documento },
        attributes: ['id']
      })
    );
  }

  public static async buscarPorUsername(username: string): Promise<any> {
    return Transformadores.extraerDataValues(
      await User.findOne({
        where: { username },
        attributes: ['id']
      })
    );
  }

  public static async buscarPorId(id: number) {
    return Transformadores.extraerDataValues(
      await User.findOne({
        attributes: [
          'id',
          'username',
          'nombrePrimero',
          'nombreSegundo',
          'apellidoPrimero',
          'apellidoSegundo',
          'documento',
          'documentoTipoId',
          'rolId',
          'inactivo'
        ],
        where: { id },
        include: [
          {
            model: Ficha
          },
          {
            model: UserCodes,
            attributes: ['id', 'start', 'finish']
          }
        ]
      })
    );
  }

  public static async actualizarUsuario(
    id: number,
    usuario: {
      username: any;
      nombrePrimero: string;
      nombreSegundo?: string;
      apellidoPrimero: string;
      apellidoSegundo?: string;
      documento: string;
      documentoTipoId: number;
      rolId: number;
      inactivo: boolean;
    }
  ) {
    const usuarioExistente = await User.findByPk(id);
    return Transformadores.extraerDataValues(
      await usuarioExistente.update({
        username: usuario.username,
        nombrePrimero: usuario.nombrePrimero,
        nombreSegundo: usuario.nombreSegundo || null,
        apellidoPrimero: usuario.apellidoPrimero,
        apellidoSegundo: usuario.apellidoSegundo || null,
        documento: usuario.documento,
        documentoTipoId: usuario.documentoTipoId,
        rolId: usuario.rolId,
        inactivo: usuario.inactivo
      })
    );
  }

  public static async cambiarContrasenna(usuarioId: number, password: string) {
    const usuarioExistente = await User.findByPk(usuarioId);
    return await usuarioExistente.update({ password });
  }
}
