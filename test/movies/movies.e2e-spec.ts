import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MoviesService } from '../../src/movies/movies.service';
import { customerToken, managerToken } from '../common/token';
import { createMovieDto, movies } from './fixture/movies';

describe('Movies (e2e)', () => {
  let app: INestApplication;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MoviesService)
      .useValue({
        create: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue(movies),
        findOne: jest.fn().mockResolvedValue(movies[1]),
        update: jest.fn().mockResolvedValue(null),
        remove: jest.fn().mockResolvedValue(null),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  describe('POST /movies', () => {
    it('should return 201)', async () => {
      const result = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', managerToken)
        .send(createMovieDto);

      expect(result.status).toBe(201);
    });

    it('should return 401 if customer is trying to create a movie', async () => {
      const result = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', customerToken)
        .send(createMovieDto);

      expect(result.status).toBe(403);
    });
  });

  describe('GET /movies', () => {
    it('should return 200', async () => {
      const result = await request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', customerToken);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(movies);
    });
  });

  describe('GET /movies/:id', () => {
    it('should return 200', async () => {
      const result = await request(app.getHttpServer())
        .get('/movies/1')
        .set('Authorization', customerToken);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(movies[1]);
    });
  });

  describe('PUT /movies/:id', () => {
    it('should return 204', async () => {
      const result = await request(app.getHttpServer())
        .put('/movies/1')
        .set('Authorization', managerToken)
        .send(createMovieDto);

      expect(result.status).toBe(204);
    });

    it('should return 403 if customer is trying to update a movie', async () => {
      const result = await request(app.getHttpServer())
        .put('/movies/1')
        .set('Authorization', customerToken)
        .send(createMovieDto);

      expect(result.status).toBe(403);
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should return 204', async () => {
      const result = await request(app.getHttpServer())
        .delete('/movies/1')
        .set('Authorization', managerToken);

      expect(result.status).toBe(204);
    });

    it('should return 403 if customer is trying to delete a movie', async () => {
      const result = await request(app.getHttpServer())
        .delete('/movies/1')
        .set('Authorization', customerToken);

      expect(result.status).toBe(403);
    });
  });
});
