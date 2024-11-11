import { Dialect } from 'sequelize';
import { Config } from 'src/Config/Config';

const config = {
  development: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE || 'database_development',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    dialect: Config.DIALECT as Dialect
  },
  test: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    dialect: Config.DIALECT as Dialect
  },
  production: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    dialect: Config.DIALECT as Dialect
  }
};

export default config;
