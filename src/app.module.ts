import { Module } from '@nestjs/common';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { FichaModule } from './modules/ficha/ficha.module';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Config } from './Config/Config';
import * as path from 'path';
import { ExcelService } from './utils/excel.service';
import { AlertasModule } from './modules/alertas/alertas.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    PacientesModule,
    UsuariosModule,
    FichaModule,
    AlertasModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(Config.STORAGE_PATH, Config.FOLDER_PUBLIC_URL),
      serveRoot: `/${Config.FOLDER_PUBLIC_URL}`,
      serveStaticOptions: {
        index: false
      }
    }),
    JwtModule.register({
      global: true,
      secret: Config.KEY_JWT,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [],
  providers: [
    ExcelService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  exports: [ExcelService]
})
export class AppModule {}
