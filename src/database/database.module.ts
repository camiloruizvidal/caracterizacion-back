import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Config } from 'src/Config/Config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: Config.DIALECT,
      host: Config.DB_HOST,
      port: Config.DB_PORT,
      username: Config.DB_USERNAME,
      password: Config.DB_PASSWORD,
      database: Config.DB_DATABASE,
      autoLoadModels: true,
      synchronize: false
    })
  ]
})
export class DatabaseModule {}
