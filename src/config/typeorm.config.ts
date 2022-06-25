import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  host: 'database-1.cqytvdjdchra.us-east-1.rds.amazonaws.com',
  username: 'admin',
  password: 'password',
  database: 'rds_database_creddit',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
