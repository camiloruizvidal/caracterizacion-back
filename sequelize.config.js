"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./src/Config/Config");
console.log({ Config: Config_1.Config });
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
console.log({ config2: config });
exports.default = config;
