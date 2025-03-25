const { Config } = require('./src/Config/Config');

module.exports = {
  development: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    dialect: Config.DIALECT
  },
  test: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    dialect: Config.DIALECT
  },
  production: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    dialect: Config.DIALECT
  }
};
