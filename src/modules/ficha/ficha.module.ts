import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { InformesService } from './service/informes/informes.service';
import { ExcelService } from 'src/utils/excel.service';

@Module({
  providers: [FichaService, InformesService, ExcelService],
  exports: [ExcelService],
  controllers: [FichaController]
})
export class FichaModule {}
