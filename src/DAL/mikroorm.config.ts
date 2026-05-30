import { defineConfig, FlushMode } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

export default defineConfig({
  entities: ['./dist/DAL/entities'],
  entitiesTs: ['./src/DAL/entities'],
  migrations: {
    snapshotName: '.snapshot-mysterybox',
    path: './dist/DAL/migrations',
    pathTs: './src/DAL/migrations',
    disableForeignKeys: false,
    transactional: true,
    allOrNothing: true,
  },
  strict: true,
  validate: true,
  allowGlobalContext: false,
  flushMode: FlushMode.COMMIT,
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: +!process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
