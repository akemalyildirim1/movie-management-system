import { Knex } from 'knex';

import { Inject, Injectable } from '@nestjs/common';

import { DATABASE_SERVICE } from '../../common';
import { TimeSlot } from '../enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDto } from './dto/ticket.dto';
import {
  SessionNotFoundException,
  TicketNotFoundException,
} from './tickets.exception';

@Injectable()
export class TicketsService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: Knex,
  ) {}

  /**
   * Create a ticket for the user.
   *
   * @param session_id Session id to create the ticket.
   * @param userId User id to create the ticket.
   * @throws SessionNotFoundException if the session is not found.
   */
  async create({ session_id }: CreateTicketDto, userId: number) {
    await this.validateSession(session_id);

    await this.databaseService.table('tickets').insert({
      user_id: userId,
      movies_session_id: session_id,
    });
  }

  /**
   * Find all tickets of the user.
   *
   * @param userId User id to filter the tickets.
   * @returns Tickets of the user.
   * @throws TicketNotFoundException if no tickets are found.
   */
  async findAll(userId: number): Promise<TicketDto[]> {
    return this.getTicketsFromDB(userId);
  }

  /**
   * Find a ticket by the user id and ticket id.
   *
   * @param userId User id to filter the tickets.
   * @param ticketId Ticket id to find.
   * @returns Ticket of the user.
   * @throws TicketNotFoundException if the ticket is not found.
   */
  async findOne(userId: number, ticketId: number): Promise<TicketDto> {
    return (await this.getTicketsFromDB(userId, ticketId))[0];
  }

  /**
   * Remove a ticket from the database.
   *
   * @param userId User id to filter the tickets.
   * @param ticketId Ticket id to remove.
   * @throws TicketNotFoundException if the ticket is not found.
   */
  async remove(userId: number, ticketId: number): Promise<void> {
    const deletedRowIds: { id: number }[] = await this.databaseService
      .table('tickets')
      .where({
        id: ticketId,
        user_id: userId,
      })
      .del('id');

    if (deletedRowIds.length === 0) {
      throw new TicketNotFoundException();
    }
  }

  /**
   * Validate the given session id.
   *
   * @param sessionId Session id to validate.
   * @throws SessionNotFoundException if the session is not found.
   */
  private async validateSession(sessionId: number): Promise<void> {
    const session: { id: number }[] = await this.databaseService
      .table('movies_sessions')
      .where('id', sessionId)
      .select('id');

    if (session.length === 0) {
      throw new SessionNotFoundException();
    }
  }

  /**
   * Get tickets from the database based on the user id and ticket id.
   *
   * @param userId User id to filter the tickets.
   * @param ticketId Ticket id to filter the tickets.
   * @returns Tickets of the user.
   * @throws TicketNotFoundException if no tickets are found.
   */
  private async getTicketsFromDB(
    userId: number,
    ticketId: number | undefined = undefined,
  ): Promise<TicketDto[]> {
    const filterStatement: { [key: string]: number } = { user_id: userId };
    if (ticketId) {
      filterStatement['tickets.id'] = ticketId;
    }

    const query: {
      ticket_id: number;
      session_id: number;
      room_id: number;
      time_slot_id: TimeSlot;
      date: string;
      movie_name: string;
    }[] = await this.databaseService
      .table('tickets')
      .join(
        'movies_sessions',
        'tickets.movies_session_id',
        'movies_sessions.id',
      )
      .join('movies', 'movies_sessions.movie_id', 'movies.id')
      .select(
        'tickets.id as ticket_id',
        'movies_sessions.id as session_id',
        'movies_sessions.room_id',
        'movies_sessions.time_slot_id',
        'movies_sessions.date',
        'movies.name as movie_name',
      )
      .where(filterStatement);

    if (query.length === 0) {
      throw new TicketNotFoundException();
    }

    return query.map(
      ({ ticket_id, session_id, room_id, time_slot_id, date, movie_name }) => ({
        id: ticket_id,
        movie_name,
        session: {
          id: session_id,
          room_id,
          time_slot_id,
          date,
        },
      }),
    );
  }
}
