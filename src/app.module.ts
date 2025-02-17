import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { FichaModule } from './modules/ficha/ficha.module';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Config } from './Config/Config';
import { join } from 'path';
import { FileReadyMiddleware } from './utils/middleware/file-read.middleware';
import { ExcelService } from './utils/excel.service';
import { AlertasModule } from './modules/alertas/alertas.module';

@Module({
  imports: [
    DatabaseModule,
    PacientesModule,
    UsuariosModule,
    FichaModule,
    AlertasModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', Config.FOLDER_FILES_URL),
      serveRoot: `/${Config.FOLDER_PUBLIC_URL}`
    })
  ],
  controllers: [],
  providers: [ExcelService],
  exports: [ExcelService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileReadyMiddleware)
      .forRoutes(`/${Config.FOLDER_PUBLIC_URL}/*`);
  }
}
