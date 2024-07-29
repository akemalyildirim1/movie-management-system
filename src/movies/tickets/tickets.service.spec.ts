import { Knex } from 'knex';

import { Test, TestingModule } from '@nestjs/testing';

import { mockDatabaseService } from '../../../test/mocks/database-service.mock';
import { createTicketDto, tickets } from '../../../test/movies/fixture/tickets';
import { DATABASE_SERVICE } from '../../common';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let databaseService: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService, mockDatabaseService],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    databaseService = module.get<Knex>(DATABASE_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValueOnce([{ id: 1 }]);
      jest.spyOn(databaseService, 'insert').mockResolvedValueOnce(null);

      await service.create(createTicketDto, 1);

      expect(databaseService.select).toHaveBeenCalledWith('id');
      expect(databaseService.where).toHaveBeenCalledWith('id', 1);

      expect(databaseService.table).toHaveBeenCalledWith('tickets');
      expect(databaseService.insert).toHaveBeenCalledWith({
        user_id: 1,
        movies_session_id: 1,
      });
    });

    it('should throw not found error if the session is not found', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValueOnce([]);

      await expect(service.create(createTicketDto, 1)).rejects.toThrow(
        'Session not found!',
      );
    });
  });

  describe('findAll and findOne', () => {
    const queryResult = [
      {
        ticket_id: 1,
        session_id: 1,
        room_id: 1,
        time_slot_id: 1,
        date: '2021-01-01',
        movie_name: 'Movie',
      },
      {
        ticket_id: 2,
        session_id: 2,
        room_id: 2,
        time_slot_id: 2,
        date: '2021-01-02',
        movie_name: 'Movie 2',
      },
    ];

    describe('findAll', () => {
      it('should find all tickets', async () => {
        jest.spyOn(databaseService, 'where').mockResolvedValueOnce(queryResult);

        const result = await service.findAll(1);

        expect(databaseService.table).toHaveBeenCalledWith('tickets');
        expect(databaseService.join).toHaveBeenCalledWith(
          'movies_sessions',
          'tickets.movies_session_id',
          'movies_sessions.id',
        );
        expect(databaseService.join).toHaveBeenCalledWith(
          'movies',
          'movies_sessions.movie_id',
          'movies.id',
        );
        expect(databaseService.select).toHaveBeenCalledWith(
          'tickets.id as ticket_id',
          'movies_sessions.id as session_id',
          'movies_sessions.room_id',
          'movies_sessions.time_slot_id',
          'movies_sessions.date',
          'movies.name as movie_name',
        );
        expect(databaseService.where).toHaveBeenCalledWith({ user_id: 1 });

        expect(result).toEqual(tickets);
      });

      it('should throw not found error if no tickets are found', async () => {
        jest.spyOn(databaseService, 'where').mockResolvedValueOnce([]);

        await expect(service.findAll(1)).rejects.toThrow('Ticket not found!');
      });
    });

    describe('findOne', () => {
      it('should find one ticket', async () => {
        jest
          .spyOn(databaseService, 'where')
          .mockResolvedValueOnce([queryResult[0]]);

        const result = await service.findOne(1, 1);

        expect(databaseService.where).toHaveBeenCalledWith({
          user_id: 1,
          'tickets.id': 1,
        });

        expect(result).toEqual(tickets[0]);
      });
    });
  });

  describe('remove', () => {
    it('should remove a ticket', async () => {
      jest.spyOn(databaseService, 'del').mockResolvedValueOnce([{ id: 30 }]);

      await service.remove(15, 30);

      expect(databaseService.table).toHaveBeenCalledWith('tickets');
      expect(databaseService.where).toHaveBeenCalledWith({
        user_id: 15,
        id: 30,
      });
      expect(databaseService.del).toHaveBeenCalled();
    });

    it('should throw not found error if no tickets are found', async () => {
      jest.spyOn(databaseService, 'del').mockResolvedValueOnce([]);

      await expect(service.remove(1, 1)).rejects.toThrow('Ticket not found!');
    });
  });
});
