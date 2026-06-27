import 'dotenv/config';

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  ingestToken: process.env.DEVICE_INGEST_TOKEN ?? 'troque-este-token',
  mysql: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE ?? 'gpsjr',
    user: process.env.MYSQL_USER ?? 'gpsjr',
    password: process.env.MYSQL_PASSWORD ?? 'gpsjr'
  }
};

