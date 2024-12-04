'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var config = {
  development: {
    username: Config_1.Config.DB_USERNAME,
    password: Config_1.Config.DB_PASSWORD,
    database: Config_1.Config.DB_DATABASE,
    host: Config_1.Config.DB_HOST,
    port: Config_1.Config.DB_PORT,
    dialect: 'postgres'
  },
  test: {
    username: Config_1.Config.DB_USERNAME,
    password: Config_1.Config.DB_PASSWORD,
    database: Config_1.Config.DB_DATABASE,
    host: Config_1.Config.DB_HOST,
    port: Config_1.Config.DB_PORT,
    dialect: 'postgres'
  },
  production: {
    username: Config_1.Config.DB_USERNAME,
    password: Config_1.Config.DB_PASSWORD,
    database: Config_1.Config.DB_DATABASE,
    host: Config_1.Config.DB_HOST,
    port: Config_1.Config.DB_PORT,
    dialect: 'postgres'
  }
};
exports.default = config;
