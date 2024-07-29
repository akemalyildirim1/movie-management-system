import { Knex } from 'knex';

import { Test, TestingModule } from '@nestjs/testing';

import { mockDatabaseService } from '../../test/mocks/database-service.mock';
import { createMovieDto, movies } from '../../test/movies/fixture/movies';
import { DATABASE_SERVICE } from '../common';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let databaseService: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, mockDatabaseService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    databaseService = module.get<Knex>(DATABASE_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValueOnce([{ id: 1 }]);
      jest
        .spyOn(databaseService, 'returning')
        .mockResolvedValueOnce([{ id: 1 }]);

      await service.create(createMovieDto);

      expect(databaseService.transaction).toHaveBeenCalled();
      expect(databaseService.table).toHaveBeenCalledWith('movies');
      expect(databaseService.insert).toHaveBeenCalledWith({
        name: createMovieDto.name,
        age_restriction: createMovieDto.age_restriction,
      });

      expect(databaseService.table).toHaveBeenCalledWith('movies_sessions');
      expect(databaseService.insert).toHaveBeenCalledWith(
        createMovieDto.sessions.map((session) => ({
          movie_id: 1,
          ...session,
        })),
      );
    });

    it('should throw a BadRequestException if the room IDs are invalid', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValueOnce([]);

      await expect(service.create(createMovieDto)).rejects.toThrow(
        'Invalid room IDs provided',
      );
    });

    it('should throw conflict exception if there is a conflict in the sessions', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValueOnce([{ id: 1 }]);
      jest
        .spyOn(databaseService, 'insert')
        .mockImplementationOnce((): any => {
          return {
            returning: jest.fn().mockResolvedValueOnce([{ id: 1 }]),
          };
        })
        .mockRejectedValueOnce(new Error('conflict'));

      await expect(service.create(createMovieDto)).rejects.toThrow(
        'The provided sessions are conflicting',
      );
    });
  });

  describe('findAll and findOne', () => {
    const queryResult: any = [
      {
        movie_id: 1,
        name: 'Movie 1',
        age_restriction: 8,
        session_id: 1,
        date: '2024-01-03',
        room_id: 1,
        time_slot_id: 1,
      },
      {
        movie_id: 1,
        name: 'Movie 1',
        age_restriction: 15,
        session_id: 2,
        date: '2024-01-03',
        room_id: 2,
        time_slot_id: 2,
      },
      {
        movie_id: 2,
        name: 'Movie 2',
        age_restriction: 18,
        session_id: 3,
        date: '2024-01-03',
        room_id: 1,
        time_slot_id: 1,
      },
    ];

    describe('findAll', () => {
      it('should return all movies', async () => {
        jest.spyOn(databaseService, 'where').mockResolvedValueOnce(queryResult);
        const result = await service.findAll();

        expect(result).toEqual([movies[1], movies[2]]);
        expect(databaseService.table).toHaveBeenCalledWith('movies');
        expect(databaseService.join).toHaveBeenCalledWith(
          'movies_sessions',
          'movies.id',
          'movies_sessions.movie_id',
        );

        expect(databaseService.select).toHaveBeenCalledWith(
          'movies.id as movie_id',
          'movies.name',
          'movies.age_restriction',
          'movies_sessions.id as session_id',
          'movies_sessions.date as date',
          'movies_sessions.room_id',
          'movies_sessions.time_slot_id',
        );
      });

      it('should throw a NotFoundException if there are no movies', async () => {
        jest.spyOn(databaseService, 'where').mockResolvedValueOnce([]);
        await expect(service.findAll()).rejects.toThrow('Movie not found!');
      });
    });

    describe('findOne', () => {
      it('should return a single movie', async () => {
        jest.spyOn(databaseService, 'select').mockReturnThis();
        jest.spyOn(databaseService, 'where').mockResolvedValueOnce(queryResult);
        const result = await service.findOne(1);

        expect(result).toEqual(movies[1]);
        expect(databaseService.table).toHaveBeenCalledWith('movies');
        expect(databaseService.join).toHaveBeenCalledWith(
          'movies_sessions',
          'movies.id',
          'movies_sessions.movie_id',
        );
        expect(databaseService.select).toHaveBeenCalledWith(
          'movies.id as movie_id',
          'movies.name',
          'movies.age_restriction',
          'movies_sessions.id as session_id',
          'movies_sessions.date as date',
          'movies_sessions.room_id',
          'movies_sessions.time_slot_id',
        );

        expect(databaseService.where).toHaveBeenCalledWith({ movie_id: 1 });
      });
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValueOnce([{ id: 1 }]);
      jest
        .spyOn(databaseService, 'returning')
        .mockResolvedValueOnce([{ id: 1 }]);

      await service.update(1, createMovieDto);

      expect(databaseService.transaction).toHaveBeenCalled();
      expect(databaseService.table).toHaveBeenCalledWith('movies');
      expect(databaseService.update).toHaveBeenCalledWith({
        name: createMovieDto.name,
        age_restriction: createMovieDto.age_restriction,
      });
      expect(databaseService.where).toHaveBeenCalledWith('id', 1);

      expect(databaseService.table).toHaveBeenCalledWith('movies_sessions');
      expect(databaseService.del).toHaveBeenCalled();

      expect(databaseService.table).toHaveBeenCalledWith('movies_sessions');
      expect(databaseService.insert).toHaveBeenCalledWith(
        createMovieDto.sessions.map((session) => ({
          movie_id: 1,
          ...session,
        })),
      );
    });

    it('should throw a NotFoundException if the movie does not exist', async () => {
      jest.spyOn(databaseService, 'returning').mockResolvedValueOnce([]);
      await expect(service.update(1, createMovieDto)).rejects.toThrow(
        'Movie not found!',
      );
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      jest.spyOn(databaseService, 'del').mockResolvedValueOnce(1);

      await service.remove(1);

      expect(databaseService.table).toHaveBeenCalledWith('movies');
      expect(databaseService.where).toHaveBeenCalledWith('id', 1);
      expect(databaseService.del).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if the movie does not exist', async () => {
      jest.spyOn(databaseService, 'del').mockResolvedValueOnce([]);

      await expect(service.remove(1)).rejects.toThrow('Movie not found!');
    });
  });
});
