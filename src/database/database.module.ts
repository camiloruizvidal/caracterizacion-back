import { Config } from 'src/Config/Config';
import { Sequelize } from 'sequelize-typescript';
import { Module } from '@nestjs/common';

const models = [];

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
