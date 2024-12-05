import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
dotenv.config();

export class Config {
  public static readonly DIALECT: Dialect = process.env
    .DATABASE_TYPE as Dialect;
  public static readonly ambiente = process.env.AMBIENTE;
  public static readonly DB_HOST = process.env.DATABASE_HOST;
  public static readonly DB_PORT = Number(process.env.DATABASE_PORT);
  public static readonly DB_USERNAME = process.env.DATABASE_USER;
  public static readonly DB_PASSWORD = process.env.DATABASE_PASS;
  public static readonly DB_DATABASE = process.env.DATABASE_NAME;
  public static readonly puerto = process.env.PORT;
  public static readonly FOLDER_FILES_URL = process.env.FILE_URL;
  public static readonly FOLDER_PUBLIC_URL = process.env.FOLDER_PUBLIC_URL;
  public static readonly CANTIDAD_REGISTROS_BULK: number = Number(
    process.env.CANTIDAD_REGISTROS_BULK
  );
  public static readonly FOLDER_FILES_TEMPORAL = 'temporal';
}
