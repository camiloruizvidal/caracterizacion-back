import { Module } from '@nestjs/common';
import { UsuariosService } from './service/usuarios/usuarios.service';
import { UsuariosController } from './controller/usuarios/usuarios.controller';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCodesEntity } from './entity/user-codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserCodesEntity])],
  providers: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
