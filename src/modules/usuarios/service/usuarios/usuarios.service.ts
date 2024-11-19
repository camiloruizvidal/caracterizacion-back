import { UserCodesEntity } from '../../entity/user-codes.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { UserEntity } from '../../entity/user.entity';
import { Between, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRolesEntity } from '../../entity/user-roles.entity';
import { DocumentTypeEntity } from 'src/utils/entity/documento-tipo.entity';
import { UsuarioRepository } from '../../repository/usuario.repository';

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

  public async loadUsersPage(
    page: number = 1,
    pageSize: number = 10,
    rolId: number = 0,
    buscar: string = ''
  ): Promise<{
    data: UserEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  }> {
    const qb = this.userRepository.createQueryBuilder('user');
    const where = [];
    if (rolId !== 0) {
      where.push(`rol_id = ${rolId}`);
    }

    if (buscar.trim() !== '') {
      buscar = buscar.trim().toLowerCase();
      where.push(
        `(
        TRIM(LOWER(user.username)) LIKE LOWER('%${buscar}%') OR
        TRIM(LOWER(user.nombrePrimero)) LIKE LOWER('%${buscar}%') OR
        TRIM(LOWER(user.nombreSegundo)) LIKE LOWER('%${buscar}%') OR
        TRIM(LOWER(user.apellidoPrimero)) LIKE LOWER('%${buscar}%') OR
        TRIM(LOWER(user.apellidoSegundo)) LIKE LOWER('%${buscar}%') OR
        TRIM(LOWER(user.documento)) LIKE LOWER('%${buscar}%'))`
      );
    }

    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await qb
      .leftJoinAndSelect('user.roles', 'roles')
      .where(where.join(' AND '))
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: data.map(user => {
        const userData = user;
        delete userData.password;
        return userData;
      }),
      totalItems,
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / pageSize),
      itemsPerPage: Number(pageSize)
    };
  }

  public async getRols() {
    return await this.userRolesRepository.find();
  }

  public async getDocumentType() {
    return await this.documentTypeRepository.find();
  }

  public async createUser(newUser: UserEntity): Promise<UserEntity> {
    newUser.password = await this.hashPassword(newUser.password);
    const createdUser = await this.userRepository.save(newUser);
    return createdUser;
  }

  public async detailUser(idUser: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: idUser },
      relations: ['fichas', 'codigos']
    });
    return user;
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
