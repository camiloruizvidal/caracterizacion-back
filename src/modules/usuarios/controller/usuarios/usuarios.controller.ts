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
    @Query('pageSize') pageSize: number
  ) {
    return this.usuariosService.loadUsersPage(page, pageSize);
  }

  @Post('')
  public createUser(@Body() newUser: UserEntity) {
    try {
      return this.usuariosService.createUser(newUser);
    } catch (error) {
      console.log({ error });
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
      const user = await this.usuariosService.validateUser(username, password);
      return { success: true, user };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
