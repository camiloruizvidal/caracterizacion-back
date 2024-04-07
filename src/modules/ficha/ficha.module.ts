import { FichaDescripcionEntity } from './entity/ficha-descripcion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { FichaGrupoEntity } from './entity/ficha-grupo.entity';
import { VersionEntity } from './entity/version.entity';
import { FichaTipoEntity } from './entity/ficha-tipo.entity';
import { BackupEntity } from './entity/backup.entity';
import { UserEntity } from '../usuarios/entity/user.entity';
import { PsicosocialPersonaEntity } from './entity/psicosocial-persona.entity';
import { FichaEntity } from './entity/ficha.entity';
import { TarjetaFamiliarEntity } from './entity/tarjeta-familiar.entity';
import { InformesService } from './service/informes/informes.service';
import { PacienteEntity } from '../pacientes/entity/pacientes.entity';
import { FichaJsonEntity } from './entity/ficha-json.entity';

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
      PsicosocialPersonaEntity,
      TarjetaFamiliarEntity,
      PacienteEntity,
      FichaJsonEntity
    ])
  ],
  providers: [FichaService, InformesService],
  controllers: [FichaController]
})
export class FichaModule {}
