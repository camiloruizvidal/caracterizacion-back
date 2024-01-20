import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { FichaModule } from './modules/ficha/ficha.module';

import typeOrmConfig from 'config/type-orm-config';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    PacientesModule,
    UsuariosModule,
    FichaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
