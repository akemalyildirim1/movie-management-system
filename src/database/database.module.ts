import * as Knex from 'knex';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DATABASE_SERVICE } from '../common';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_SERVICE,
      useFactory: (configService: ConfigService) => {
        return Knex({
          client: 'pg',
          connection: {
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            user: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
          },
          pool: {
            min: 2,
            max: 10,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_SERVICE],
})
export class DatabaseModule {}
