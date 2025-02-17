import { Module } from '@nestjs/common';
import { AlertasController } from './controller/alertas.controller';

@Module({
  providers: [],
  exports: [],
  controllers: [AlertasController]
})
export class AlertasModule {}
