import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { customerToken } from '../common/token';
import { TicketsService } from '../../src/movies/tickets/tickets.service';
import { createTicketDto, tickets } from './fixture/tickets';

describe('Tickets (e2e)', () => {
  let app: INestApplication;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TicketsService)
      .useValue({
        create: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue(tickets),
        findOne: jest.fn().mockResolvedValue(tickets[0]),
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

  describe('POST /tickets', () => {
    it('should return 201)', async () => {
      const result = await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', customerToken)
        .send(createTicketDto);

      expect(result.status).toBe(201);
    });
  });

  describe('GET /tickets', () => {
    it('should return 200', async () => {
      const result = await request(app.getHttpServer())
        .get('/tickets')
        .set('Authorization', customerToken);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(tickets);
    });
  });

  describe('GET /tickets/:id', () => {
    it('should return 200', async () => {
      const result = await request(app.getHttpServer())
        .get('/tickets/1')
        .set('Authorization', customerToken);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(tickets[0]);
    });
  });

  describe('DELETE /tickets/:id', () => {
    it('should return 204', async () => {
      const result = await request(app.getHttpServer())
        .delete('/tickets/1')
        .set('Authorization', customerToken);

      expect(result.status).toBe(204);
    });
  });
});
