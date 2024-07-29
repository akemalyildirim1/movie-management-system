import * as bcryptjs from 'bcryptjs';
import { Knex } from 'knex';

import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { DATABASE_SERVICE } from '../common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: Knex;
  let jwtService: JwtService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DATABASE_SERVICE,
          useValue: {
            table: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            first: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<Knex>(DATABASE_SERVICE);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token and token type', async () => {
      jest.spyOn(databaseService, 'first').mockResolvedValue({
        id: 1,
        username: 'test',
        password: 'hashedpassword',
        role_id: 2,
      });

      const compareSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(true);

      const result = await service.login({
        username: 'test',
        password: 'test',
      });

      expect(result).toEqual({ token: 'token', token_type: 'Bearer' });
      expect(databaseService.table).toHaveBeenCalledWith('users');
      expect(databaseService.select).toHaveBeenCalledWith(
        'id',
        'username',
        'password',
        'role_id',
      );
      expect(databaseService.where).toHaveBeenCalledWith({ username: 'test' });
      expect(databaseService.first).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        userId: 1,
        roleId: 2,
      });
      expect(compareSpy).toHaveBeenCalledWith('test', 'hashedpassword');
    });

    it("should raise exception if username couldn't be found", async () => {
      jest.spyOn(databaseService, 'first').mockResolvedValue(undefined);

      await expect(
        service.login({ username: 'test', password: 'test' }),
      ).rejects.toThrow('Invalid email or password!');
    });

    it('should raise exception if password is incorrect', async () => {
      jest.spyOn(databaseService, 'first').mockResolvedValue({
        id: 1,
        username: 'test',
        password: 'hashedpassword',
        role_id: 2,
      });
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false);

      await expect(
        service.login({ username: 'test', password: 'test' }),
      ).rejects.toThrow('Invalid email or password!');
    });
  });
});
