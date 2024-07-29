import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TicketsModule } from './tickets/tickets.module';
import { WatchModule } from './watch/watch.module';

@Module({
  imports: [DatabaseModule, TicketsModule, WatchModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
