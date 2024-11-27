import { UserCodesEntity } from '../../entity/user-codes.entity';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { UserEntity } from '../../entity/user.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRolesEntity } from '../../entity/user-roles.entity';
import { DocumentTypeEntity } from 'src/utils/entity/documento-tipo.entity';
import { UsuarioRepository } from '../../repository/usuario.repository';
import { RolesRepository } from '../../repository/roles.repository';
import { DocumentoTipoRepository } from '../../repository/documento-tipo.repository';
import { UsuarioCrearDto } from '../../dto/usuario-crear.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UserCodesEntity)
    private readonly userCodesRepository: Repository<UserCodesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserRolesEntity)
    private readonly userRolesRepository: Repository<UserRolesEntity>,
    @InjectRepository(DocumentTypeEntity)
    private readonly documentTypeRepository: Repository<DocumentTypeEntity>
  ) {}

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

    usuarioNuevo.password = await this.hashPassword(usuarioNuevo.password);
    return await UsuarioRepository.crearUsuario(usuarioNuevo);
  }

  public async detailUser(idUser: number): Promise<UserEntity> {
    return await UsuarioRepository.buscarPorId(idUser);
  }

  public async updateUser(id: number, updatedUser: any): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updatedUser.password) {
      updatedUser.password = await this.hashPassword(updatedUser.password);
    }
    if (updatedUser?.codigoInicial != '' && updatedUser?.codigoFinal != '') {
      const codes = this.userCodesRepository.create({
        user_id: id,
        start: updatedUser.codigoInicial,
        finish: updatedUser.codigoFinal
      });
      this.createCodesByUser(codes);
    }

    const mergedUser = this.userRepository.merge(existingUser, updatedUser);
    const result = await this.userRepository.save(mergedUser);
    delete result.password;
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async cambiarPass(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const nuevaContrasenna = user.documento;
    const hashedPassword = await bcrypt.hash(nuevaContrasenna, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return user;
  }

  public async validarUsuario(
    usuario: string,
    password: string
  ): Promise<UserEntity> {
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

  async createCodesByUser(
    userCodeData: UserCodesEntity
  ): Promise<UserCodesEntity> {
    const { start, finish } = userCodeData;
    const existingCodes = await this.userCodesRepository.find({
      where: {
        start: Between(start, finish),
        finish: Between(start, finish)
      }
    });

    if (existingCodes.length > 0) {
      throw new BadRequestException(
        'Los códigos se solapan con códigos existentes'
      );
    }

    const newUserCodes = this.userCodesRepository.create(userCodeData);
    return this.userCodesRepository.save(newUserCodes);
  }

  public async findAllCodes(userId: number): Promise<UserCodesEntity[]> {
    return this.userCodesRepository.find({
      select: ['start', 'finish'],
      where: { user_id: userId },
      order: { start: 'ASC' }
    });
  }
}
