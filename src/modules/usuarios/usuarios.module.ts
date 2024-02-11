import { Module } from '@nestjs/common';
import { UsuariosService } from './service/usuarios/usuarios.service';
import { UsuariosController } from './controller/usuarios/usuarios.controller';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCodesEntity } from './entity/user-codes.entity';
import { UserRolesEntity } from './entity/user-roles.entity';
import { DocumentTypeEntity } from 'src/utils/entity/documento-tipo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserCodesEntity,
      UserRolesEntity,
      DocumentTypeEntity
    ])
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
