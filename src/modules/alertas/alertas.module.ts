import { Module } from '@nestjs/common';
import { AlertasController } from './controller/alertas.controller';
import { AlertasService } from './service/alertas.service';

@Module({
  providers: [AlertasService],
  exports: [AlertasService],
  controllers: [AlertasController]
})
export class AlertasModule {}
