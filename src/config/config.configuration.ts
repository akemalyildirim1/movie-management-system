import { ApplicationConfiguration } from './config.model';

export const configuration = (): ApplicationConfiguration => ({
  PORT: +process.env.PORT,
  DB: {
    HOST: process.env.DB_HOST,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
    PORT: +process.env.DB_PORT,
  },
  JWT_SECRET: process.env.JWT_SECRET,
});
