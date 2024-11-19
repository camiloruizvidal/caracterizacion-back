import { UserEntity } from '../../entity/user.entity';
import { UsuariosService } from './../../service/usuarios/usuarios.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException
} from '@nestjs/common';

@Controller('/api/v1/usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get('')
  public getUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('rolId') rolId: number,
    @Query('buscar') buscar: string
  ) {
    return this.usuariosService.loadUsersPage(
      page,
      pageSize,
      Number(rolId),
      buscar
    );
  }

  @Get('/roles')
  public async getRols() {
    return await this.usuariosService.getRols();
  }

  @Get('/detail/:id')
  public async detailUser(@Param('id') id: number) {
    return await this.usuariosService.detailUser(id);
  }

  @Get('/documentoTipo')
  public async documentoTipo() {
    return await this.usuariosService.getDocumentType();
  }

  @Post('')
  public createUser(@Body() newUser: UserEntity) {
    try {
      return this.usuariosService.createUser(newUser);
    } catch (error) {
      return error;
    }
  }

  @Put('/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() updatedUser: Partial<UserEntity>
  ) {
    try {
      const result = await this.usuariosService.updateUser(id, updatedUser);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body() { username, password }: { username: string; password: string }
  ) {
    try {
      const user = await this.usuariosService.validarUsuario(
        username,
        password
      );
      return { success: true, user };
    } catch (error) {
      throw new UnauthorizedException(error.response);
    }
  }

  @Post('cambiarPass')
  async cambiarPass(@Body() { id }: { id: number }) {
    try {
      await this.usuariosService.cambiarPass(id);
      return { success: true };
    } catch (error) {
      throw new UnauthorizedException(error.response);
    }
  }
}
