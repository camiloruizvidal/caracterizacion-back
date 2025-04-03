import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { FichaService } from './service/ficha/ficha.service';
import { FichaController } from './controller/ficha/ficha.controller';
import { CargaController } from './controller/carga/carga.controller';
import { InformesService } from './service/informes/informes.service';
import { ExcelService } from 'src/utils/excel.service';
import { WordAPdfService } from 'src/utils/word-a-pdf.service';
import { ManejadorErrorService } from 'src/utils/manejador-error.service';
import { ArchivosService } from 'src/utils/archivos.service';
import { CargaService } from './service/carga/carga.service';
import { DatabaseModule } from 'src/database/database.module';
import { VerificarEstadoExcelMiddleware } from './middleware/verificar-estado-excel.middleware';

@Module({
  imports: [DatabaseModule],
  providers: [
    FichaService,
    InformesService,
    ExcelService,
    WordAPdfService,
    ManejadorErrorService,
    ArchivosService,
    CargaService,
    VerificarEstadoExcelMiddleware
  ],
  exports: [ExcelService],
  controllers: [FichaController, CargaController]
})
export class FichaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerificarEstadoExcelMiddleware)
      .forRoutes({ path: 'public/*', method: RequestMethod.GET });
  }
}
