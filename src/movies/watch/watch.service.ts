import { Knex } from 'knex';

import { Inject, Injectable } from '@nestjs/common';

import { DATABASE_SERVICE } from '../../common';
import { CreateWatchDto } from './dto/create-watch.dto';
import { WatchHistoryDto } from './dto/watch-history.dto';
import {
  ForbiddenTicketException,
  TicketAlreadyUsedException,
} from './watch.exceptions';

@Injectable()
export class WatchService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: Knex,
  ) {}

  async create(userId: number, createWatchDto: CreateWatchDto): Promise<void> {
    await this.validateTicketOwnership(userId, createWatchDto.ticket_id);

    try {
      await this.databaseService.table('watch_history').insert({
        ticket_id: createWatchDto.ticket_id,
      });
    } catch (error) {
      throw new TicketAlreadyUsedException();
    }
  }

  async getWatchHistory(userId: number): Promise<WatchHistoryDto[]> {
    return this.databaseService
      .table('watch_history')
      .join('tickets', 'watch_history.ticket_id', 'tickets.id')
      .join(
        'movies_sessions',
        'tickets.movies_session_id',
        'movies_sessions.id',
      )
      .join('movies', 'movies_sessions.movie_id', 'movies.id')
      .select(
        'movies.name as movie_name',
        'watch_history.created_at as watched_at',
      )
      .where('tickets.user_id', userId);
  }

  private async validateTicketOwnership(
    userId: number,
    ticketId: number,
  ): Promise<void> {
    const ticketIdsFromDb: { id: number }[] = await this.databaseService
      .table('tickets')
      .select('id')
      .where({
        id: ticketId,
        user_id: userId,
      });

    if (ticketIdsFromDb.length === 0) {
      throw new ForbiddenTicketException();
    }
  }
}
