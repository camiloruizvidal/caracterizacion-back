import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
  public static readonly DIALECT = process.env.DATABASE_TYPE;
  public static readonly DB_HOST = process.env.DATABASE_HOST;
  public static readonly DB_PORT = process.env.DATABASE_PORT;
  public static readonly DB_USERNAME = process.env.DATABASE_USER;
  public static readonly DB_PASSWORD = process.env.DATABASE_PASS;
  public static readonly DB_DATABASE = process.env.DB_DATABASE;
  public static readonly PUERTO = 3000;
}
