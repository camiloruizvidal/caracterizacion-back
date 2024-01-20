import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { FichaDescripcionEntity } from './entity/ficha_description.entity';
import { FichaGrupoEntity } from './entity/ficha_grupo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FichaDescripcionEntity, FichaGrupoEntity]),
  ],
  providers: [FichaService],
  controllers: [FichaController]
})
export class FichaModule {}
