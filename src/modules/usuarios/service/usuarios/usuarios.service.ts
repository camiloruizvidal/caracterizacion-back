import { UserCodesEntity } from '../../entity/user-codes.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { UserEntity } from '../../entity/user.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UserCodesEntity)
    private readonly userCodesRepository: Repository<UserCodesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  public async loadUsersPage(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: UserEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  }> {
    const [data, totalItems] = await this.getPaginatedUsers(page, pageSize);

    return {
      data: data.map(user => {
        const userData = user;
        delete userData.password;
        return userData;
      }),
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      itemsPerPage: pageSize
    };
  }

  private async getPaginatedUsers(
    page: number,
    pageSize: number
  ): Promise<[UserEntity[], number]> {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await this.userRepository.findAndCount({
      take: pageSize,
      skip
    });

    return [data, totalItems];
  }

  public async createUser(newUser: UserEntity): Promise<UserEntity> {
    newUser.password = await this.hashPassword(newUser.password);
    const createdUser = await this.userRepository.save(newUser);
    return createdUser;
  }

  public async updateUser(
    id: number,
    updatedUser: Partial<UserEntity>
  ): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updatedUser.password) {
      updatedUser.password = await this.hashPassword(updatedUser.password);
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

  public async validateUser(
    username: string,
    password: string
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    user['codes'] = await this.findAllCodes(user.id);

    return user;
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
      where: { user_id: userId },
      order: { start: 'ASC' }
    });
  }
}
