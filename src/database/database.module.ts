import { DocumentoTipo } from './../modules/usuarios/model/documento-tipo.model';
import { TarjetaFamiliar } from './../modules/ficha/model/tarjeta-familiar.model';
import { Ficha } from './../modules/ficha/model/ficha.model';
import { Config } from 'src/Config/Config';
import { Sequelize } from 'sequelize-typescript';
import { Module } from '@nestjs/common';
import { User } from 'src/modules/usuarios/model/user.model';
import { UserRoles } from 'src/modules/usuarios/model/user-roles.model';
import { PsicosocialPersona } from 'src/modules/ficha/model/psicosocial-persona.model';
import { Paciente } from 'src/modules/pacientes/model/paciente.model';
import { UserCodes } from 'src/modules/usuarios/model/user-codes.model';
import { FichaGrupo } from 'src/modules/ficha/model/ficha-grupo.model';
import { FichaTipo } from 'src/modules/ficha/model/ficha-tipo.model';
import { FichaDescripcion } from 'src/modules/ficha/model/ficha-descripcion.model';
import { Backup } from 'src/modules/ficha/model/backup.model';
import { Version } from 'src/modules/ficha/model/version.model';
import { FichaJson } from 'src/modules/ficha/model/ficha-json.model';
import { FichaProcesada } from 'src/modules/ficha/model/ficha-procesada.model';

const models = [
  PsicosocialPersona,
  Paciente,
  UserCodes,
  TarjetaFamiliar,
  DocumentoTipo,
  Ficha,
  FichaTipo,
  FichaGrupo,
  FichaDescripcion,
  UserRoles,
  User,
  Backup,
  Version,
  FichaJson,
  FichaProcesada
];

const databaseProvider = {
  provide: 'SEQUELIZE_SICP',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: Config.DIALECT,
      dialectOptions: {
        multipleStatements: true
      },
      host: Config.DB_HOST,
      port: Config.DB_PORT,
      username: Config.DB_USERNAME,
      password: Config.DB_PASSWORD,
      database: Config.DB_DATABASE,
      logging: true
    });
    sequelize.addModels(models);
    return sequelize;
  }
};

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider]
})
export class DatabaseModule {}
