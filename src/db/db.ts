import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { Logger } from '@nestjs/common';

const logger = new Logger('Database');

const connectionString = process.env.POSTGRES_URL;

logger.log(
  `Attempting to connect to database with connection string: ${connectionString?.replace(/:[^:@]+@/, ':****@')}`,
);

const pool = new Pool({
  connectionString,
  ssl: false,
});

export const db = drizzle(pool, { schema });

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    logger.error(`Error connecting to the database: ${err.message}`);
    return;
  }
  logger.log('Successfully connected to the database');
  release();
});
