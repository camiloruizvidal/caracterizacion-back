import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { FichaModule } from './modules/ficha/ficha.module';
import { DataModule } from './modules/data/data.module';
import typeOrmConfig from 'config/type-orm-config';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Config } from './Config/Config';
import { join } from 'path';

console.log('joinfolder', join(__dirname, '..', '..', Config.FOLDER_FILES_URL));
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    PacientesModule,
    UsuariosModule,
    FichaModule,
    DataModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', Config.FOLDER_FILES_URL),
      serveRoot: `/${Config.FOLDER_PUBLIC_URL}`
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
