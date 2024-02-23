import { Module } from '@nestjs/common';
import { DataController } from './controllers/data/data.controller';
import { DataService } from './services/data/data.service';
import { FichaDescripcionEntity } from '../ficha/entity/ficha-descripcion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../usuarios/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FichaDescripcionEntity, UserEntity])],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule {}
