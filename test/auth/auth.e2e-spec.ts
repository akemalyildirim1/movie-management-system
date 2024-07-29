import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { accessToken } from './fixture/accessToken';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue({
        login: jest.fn().mockResolvedValue(accessToken),
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

  describe('POST /auth/login', () => {
    it('should return token and 201)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(accessToken);
    });
  });
});
