import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioRepository } from '../../repository/usuario.repository';
import { RolesRepository } from '../../repository/roles.repository';
import { DocumentoTipoRepository } from '../../repository/documento-tipo.repository';
import { UsuarioCrearDto } from '../../dto/usuario-crear.dto';
import { UsuarioCodigosRepository } from '../../repository/usuario-codigos.repository';
import { UsuarioActualizarDTO } from '../../dto/usuario-actualizar.dto';

@Injectable()
export class UsuariosService {
  public async cargarUsuariosPaginados(
    page: number = 1,
    pageSize: number = 10,
    rolId: number = 0,
    buscar: string = ''
  ) {
    const usuarios = await UsuarioRepository.buscarUsuariosPaginados(
      page,
      pageSize,
      rolId,
      buscar
    );
    usuarios['currentPage'] = Number(page);
    usuarios['totalPages'] = Math.ceil(usuarios.count / pageSize);
    usuarios['itemsPerPage'] = Number(pageSize);

    return usuarios;
  }

  public async getRols() {
    return await RolesRepository.verRoles();
  }

  public async getDocumentType() {
    return await DocumentoTipoRepository.cargarDocumentosTipos();
  }

  public async createUser(usuarioNuevo: UsuarioCrearDto): Promise<any> {
    if (usuarioNuevo.password !== usuarioNuevo.passwordRepeat) {
      throw new ConflictException(`Las contraseñas no coinciden`);
    }

    const usuarioPorDocumento = await UsuarioRepository.buscarPorDocumento(
      usuarioNuevo.documento
    );

    if (usuarioPorDocumento) {
      throw new ConflictException(
        `El documento ${usuarioNuevo.documento} ya está registrado`
      );
    }

    const usuarioPorUsername = await UsuarioRepository.buscarPorUsername(
      usuarioNuevo.username
    );

    if (usuarioPorUsername) {
      throw new ConflictException(
        `El nombre de usuario ${usuarioNuevo.username} ya está registrado`
      );
    }

    usuarioNuevo.password = await this.encriptarContrasenna(
      usuarioNuevo.password
    );
    return await UsuarioRepository.crearUsuario(usuarioNuevo);
  }

  public async detailUser(idUser: number): Promise<any> {
    return await UsuarioRepository.buscarPorId(idUser);
  }

  public async updateUser(
    id: number,
    updatedUser: UsuarioActualizarDTO
  ): Promise<any> {
    const usuario = await UsuarioRepository.buscarPorId(id);

    if (!usuario) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updatedUser.password.trim() !== updatedUser.passwordRepeat.trim()) {
      throw new ConflictException('La contraseña no es igual');
    }

    if (updatedUser.password && updatedUser.password.trim() !== '') {
      updatedUser.password = await this.encriptarContrasenna(
        updatedUser.password
      );
    }

    if (updatedUser?.codigoInicial && updatedUser?.codigoFinal) {
      UsuarioCodigosRepository.asignarCodigo(
        updatedUser.codigoInicial,
        updatedUser.codigoFinal,
        id
      );
    }

    await UsuarioRepository.actualizarUsuario(id, {
      username: updatedUser.username,
      nombrePrimero: updatedUser.nombrePrimero,
      nombreSegundo: updatedUser.nombreSegundo,
      apellidoPrimero: updatedUser.apellidoPrimero,
      apellidoSegundo: updatedUser.apellidoSegundo,
      documento: updatedUser.documento.toString(),
      documentoTipoId: Number(updatedUser.documentoTipoId),
      rolId: Number(updatedUser.rolId),
      inactivo: updatedUser.inactivo
    });

    return await UsuarioRepository.buscarPorId(id);
  }

  private async encriptarContrasenna(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async cambiarPass(usuarioId: number) {
    const usuario = await UsuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const nuevaContrasenna = await this.encriptarContrasenna(usuario.documento);
    await UsuarioRepository.cambiarContrasenna(usuarioId, nuevaContrasenna);

    return usuario;
  }

  public async validarUsuario(usuario: string, password: string): Promise<any> {
    try {
      const user = await UsuarioRepository.buscarUsuarioConCodigos(usuario);
      if (!user) {
        throw new UnauthorizedException('Usurio no inválido.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Contrasenna inválida.');
      }

      delete user.password;
      user['currentCode'] = 1;

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
