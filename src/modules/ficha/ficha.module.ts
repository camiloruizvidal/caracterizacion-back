import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { InformesService } from './service/informes/informes.service';
import { ExcelService } from 'src/utils/excel.service';
import { WordAPdfService } from 'src/utils/word-a-pdf.service';
import { ManejadorErrorService } from 'src/utils/manejador-error.service';

@Module({
  providers: [
    FichaService,
    InformesService,
    ExcelService,
    WordAPdfService,
    ManejadorErrorService
  ],
  exports: [ExcelService],
  controllers: [FichaController]
})
export class FichaModule {}
