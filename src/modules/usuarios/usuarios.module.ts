import { Module } from '@nestjs/common';
import { UsuariosService } from './service/usuarios/usuarios.service';
import { UsuariosController } from './controller/usuarios/usuarios.controller';

@Module({
  providers: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
