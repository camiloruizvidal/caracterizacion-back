import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: true
};

export default typeOrmConfig;
