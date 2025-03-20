import { Module } from '@nestjs/common';
import { UsuariosService } from './service/usuarios/usuarios.service';
import { UsuariosController } from './controller/usuarios/usuarios.controller';
import { Config } from 'src/Config/Config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UsuariosService],
  controllers: [UsuariosController],
  imports: [
    JwtModule.register({
      secret: Config.KEY_JWT,
      signOptions: { expiresIn: '1d' }
    })
  ]
})
export class UsuariosModule {}
