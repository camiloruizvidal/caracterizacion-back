import { Module } from '@nestjs/common';
import { PacientesController } from './controller/pacientes/pacientes.controller';
import { PacientesService } from './service/pacientes/pacientes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './entity/pacientes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity])],
  controllers: [PacientesController],
  providers: [PacientesService]
})
export class PacientesModule {}
