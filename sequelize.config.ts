import { Config } from './src/Config/Config';

console.log({ Config });
const config = {
  development: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    dialect: 'postgres'
  },
  test: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    dialect: 'postgres'
  },
  production: {
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_DATABASE,
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    dialect: 'postgres'
  }
};
console.log({config2: config})
export default config;
