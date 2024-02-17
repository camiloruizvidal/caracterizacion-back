import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { FichaModule } from './modules/ficha/ficha.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import typeOrmConfig from 'config/type-orm-config';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PacientesModule,
    UsuariosModule,
    FichaModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public')
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
