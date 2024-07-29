import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration, validateEnvironmentVariables } from './config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { MoviesModule } from './movies/movies.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironmentVariables,
    }),
    UsersModule,
    LoggerModule,
    DatabaseModule,
    AuthModule,
    RoomsModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
