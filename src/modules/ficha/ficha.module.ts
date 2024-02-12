import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { FichaDescripcionEntity } from './entity/fichaDescription.entity';
import { FichaGrupoEntity } from './entity/fichaGrupo.entity';
import { VersionEntity } from './entity/version.entity';
import { FichaTipoEntity } from './entity/fichaTipo.entity';
import { BackupEntity } from './entity/backup.entity';
import { UserEntity } from '../usuarios/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FichaDescripcionEntity,
      FichaGrupoEntity,
      FichaTipoEntity,
      VersionEntity,
      BackupEntity,
      UserEntity
    ])
  ],
  providers: [FichaService],
  controllers: [FichaController]
})
export class FichaModule {}
