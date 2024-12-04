'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Config = void 0;
var dotenv = require('dotenv');
dotenv.config();
var Config = /** @class */ (function () {
  function Config() {}
  Config.DIALECT = process.env.DATABASE_TYPE;
  Config.DB_HOST = process.env.DATABASE_HOST;
  Config.DB_PORT = Number(process.env.DATABASE_PORT);
  Config.DB_USERNAME = process.env.DATABASE_USER;
  Config.DB_PASSWORD = process.env.DATABASE_PASS;
  Config.DB_DATABASE = process.env.DATABASE_NAME;
  Config.PUERTO = 3000;
  return Config;
})();
exports.Config = Config;
