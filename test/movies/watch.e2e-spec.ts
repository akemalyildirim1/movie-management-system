import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { customerToken } from '../common/token';
import { WatchService } from '../../src/movies/watch/watch.service';
import { createWatchDto, watchHistoryArray } from './fixture/watch';

describe('Watch (e2e)', () => {
  let app: INestApplication;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WatchService)
      .useValue({
        create: jest.fn().mockResolvedValue(null),
        getWatchHistory: jest.fn().mockResolvedValue(watchHistoryArray),
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

  describe('POST /watch', () => {
    it('should return 201)', async () => {
      const result = await request(app.getHttpServer())
        .post('/watch')
        .set('Authorization', customerToken)
        .send(createWatchDto);

      expect(result.status).toBe(201);
    });
  });

  describe('GET /watch/history', () => {
    it('should return 200', async () => {
      const result = await request(app.getHttpServer())
        .get('/watch/history')
        .set('Authorization', customerToken);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(watchHistoryArray);
    });
  });
});
