import { Module } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { InformesService } from './service/informes/informes.service';
import { ExcelService } from 'src/utils/excel.service';
import { WordToPdfService } from 'src/utils/word-to-pdf.service';

@Module({
  providers: [FichaService, InformesService, ExcelService, WordToPdfService],
  exports: [ExcelService],
  controllers: [FichaController]
})
export class FichaModule {}
