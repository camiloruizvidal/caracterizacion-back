import { Module } from '@nestjs/common';
import { UsuariosService } from './service/usuarios/usuarios.service';
import { UsuariosController } from './controller/usuarios/usuarios.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../../config/config';
import { ManejadorErrorService } from 'src/utils/manejador-error.service';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.KEY_JWT,
      signOptions: { expiresIn: '1d' }
    })
  ],
  providers: [UsuariosService, ManejadorErrorService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
