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
import { PersonaEntity } from './entity/persona.entity';
import { PsicosocialPersonaEntity } from './entity/psicosocial-persona.entity';
import { FichaEntity } from './entity/ficha.entity';
import { TarjetaFamiliarEntity } from './entity/tarjetaFamiliar.entity';
import { InformesService } from './service/informes/informes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FichaDescripcionEntity,
      FichaGrupoEntity,
      FichaTipoEntity,
      FichaEntity,
      VersionEntity,
      BackupEntity,
      UserEntity,
      PersonaEntity,
      PsicosocialPersonaEntity,
      TarjetaFamiliarEntity
    ])
  ],
  providers: [FichaService, InformesService],
  controllers: [FichaController]
})
export class FichaModule {}
