import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { FichaDescripcionEntity } from './entity/fichaDescription.entity';
import { FichaGrupoEntity } from './entity/fichaGrupo.entity';
import { VersionEntity } from './entity/version.entity';
import { FichaTipoEntity } from './entity/fichaTipo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FichaDescripcionEntity,
      FichaGrupoEntity,
      FichaTipoEntity,
      VersionEntity
    ])
  ],
  providers: [FichaService],
  controllers: [FichaController]
})
export class FichaModule {}
