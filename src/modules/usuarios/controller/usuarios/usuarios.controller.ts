import { UserEntity } from '../../entity/user.entity';
import { UsuariosService } from './../../service/usuarios/usuarios.service';
import { plainToInstance } from 'class-transformer';
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
import { RolesDto } from '../../dto/roles.dto';
import { UsuariosPaginadosDto } from '../../dto/usuarios-paginados.dto';
import { UsuarioCrearDto } from '../../dto/usuario-crear.dto';
import { UsuarioResponseDto } from '../../dto/usuario-response.dto';
import { UsuarioEditadoDto } from '../../dto/usuario-editado.dto';
import { UsuarioActualizarDTO } from '../../dto/usuario-actualizar.dto';

@Controller('/api/v1/usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get('')
  public async getUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('rolId') rolId: number,
    @Query('buscar') buscar: string
  ) {
    try {
      const usuarios = await this.usuariosService.cargarUsuariosPaginados(
        page,
        pageSize,
        Number(rolId),
        buscar
      );
      return plainToInstance(UsuariosPaginadosDto, usuarios);
    } catch (error) {
      return error;
    }
  }

  @Get('/roles')
  public async getRols() {
    try {
      const roles = await this.usuariosService.getRols();
      return plainToInstance(RolesDto, roles);
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      throw error;
    }
  }

  @Get('/detail/:id')
  public async detailUser(@Param('id') id: number) {
    const usuario = await this.usuariosService.detailUser(id);
    return plainToInstance(UsuarioEditadoDto, usuario);
  }

  @Get('/documentoTipo')
  public async documentoTipo() {
    return await this.usuariosService.getDocumentType();
  }

  @Post('')
  public async createUser(@Body() newUser: UsuarioCrearDto) {
    try {
      const usuario = await this.usuariosService.createUser(newUser);
      return plainToInstance(UsuarioResponseDto, usuario);
    } catch (error) {
      return error;
    }
  }

  @Put('/:id')
  public async updateUser(
    @Param('id') id: number,
    @Body() updatedUser: UsuarioActualizarDTO
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
