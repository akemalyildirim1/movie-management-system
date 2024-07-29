import { Knex } from 'knex';

import { Test, TestingModule } from '@nestjs/testing';

import { mockDatabaseService } from '../../../test/mocks/database-service.mock';
import {
  createWatchDto,
  watchHistoryArray,
} from '../../../test/movies/fixture/watch';
import { DATABASE_SERVICE } from '../../common';
import { WatchService } from './watch.service';

describe('WatchService', () => {
  let service: WatchService;
  let databaseService: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchService, mockDatabaseService],
    }).compile();

    service = module.get<WatchService>(WatchService);
    databaseService = module.get<Knex>(DATABASE_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('watch', () => {
    it('should raise an error if ticket is not owned by user', async () => {
      jest.spyOn(databaseService, 'where').mockResolvedValue([]);

      await expect(service.create(1, createWatchDto)).rejects.toThrow(
        "You can't use this ticket!",
      );
    });

    it('should raise an error if ticket is already used', async () => {
      jest.spyOn(databaseService, 'where').mockResolvedValue([{ id: 1 }]);
      jest.spyOn(databaseService, 'insert').mockRejectedValue(new Error());

      await expect(service.create(1, createWatchDto)).rejects.toThrow(
        'You have already watched this movie.',
      );
    });

    it('should create a watch history', async () => {
      jest.spyOn(databaseService, 'where').mockResolvedValue([{ id: 1 }]);
      jest.spyOn(databaseService, 'insert').mockResolvedValue(undefined);

      await service.create(1, createWatchDto);

      expect(databaseService.table).toHaveBeenCalledWith('tickets');
      expect(databaseService.select).toHaveBeenCalledWith('id');
      expect(databaseService.where).toHaveBeenCalledWith({
        id: createWatchDto.ticket_id,
        user_id: 1,
      });

      expect(databaseService.table).toHaveBeenCalledWith('watch_history');
      expect(databaseService.insert).toHaveBeenCalledWith({
        ticket_id: createWatchDto.ticket_id,
      });
    });
  });

  describe('getWatchHistory', () => {
    it('should return watch history', async () => {
      jest.spyOn(databaseService, 'where').mockResolvedValue(watchHistoryArray);
      const result = await service.getWatchHistory(1);
      expect(result).toEqual(watchHistoryArray);

      expect(databaseService.table).toHaveBeenCalledWith('watch_history');
      expect(databaseService.select).toHaveBeenCalledWith(
        'movies.name as movie_name',
        'watch_history.created_at as watched_at',
      );
      expect(databaseService.where).toHaveBeenCalledWith('tickets.user_id', 1);
    });
  });
});
