import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/users/users.service';

describe('User (e2e)', () => {
  let app: INestApplication;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue({
        register: jest.fn().mockResolvedValue(undefined),
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

  describe('POST /users/register', () => {
    it('should return 201)', async () => {
      const result = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          username: 'test',
          password: 'Test1234!',
          age: 20,
          role_id: 1,
        });

      expect(result.status).toBe(201);
    });
  });
});
