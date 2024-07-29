import { Test, TestingModule } from '@nestjs/testing';

import { createMovieDto, movies } from '../../test/movies/fixture/movies';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            create: jest.fn().mockResolvedValue(null),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn().mockResolvedValue(null),
            remove: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the correct create function', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(null);
      await controller.create(createMovieDto);

      expect(service.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('findAll', () => {
    it('should call the correct findAll function', async () => {
      const moviesArray = Object.values(movies);
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(moviesArray);
      const result = await controller.findAll();

      expect(result).toEqual(moviesArray);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the correct findOne function', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(movies[1]);
      const result = await controller.findOne('1');

      expect(result).toEqual(movies[1]);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call the correct update function', async () => {
      await controller.update('1', createMovieDto);

      expect(service.update).toHaveBeenCalledWith(1, createMovieDto);
    });
  });

  describe('remove', () => {
    it('should call the correct remove function', async () => {
      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
