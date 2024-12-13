import { ManejadorErrorService } from './../../utils/manejador-error.service';
import { Module } from '@nestjs/common';
import { PacientesController } from './controller/pacientes/pacientes.controller';
import { PacientesService } from './service/pacientes/pacientes.service';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService, ManejadorErrorService]
})
export class PacientesModule {}
