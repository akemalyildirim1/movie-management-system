import { Knex } from 'knex';

import { Test, TestingModule } from '@nestjs/testing';

import { mockDatabaseService } from '../../test/mocks/database-service.mock';
import { DATABASE_SERVICE } from '../common';
import { UsersService } from './users.service';

describe('UserService', () => {
  let service: UsersService;
  let databaseService: Knex;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, mockDatabaseService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    databaseService = module.get(DATABASE_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const userRegisterDto = {
      username: 'testuser',
      password: 'password',
      age: 20,
      role_id: 1,
    };
    it('should insert user to database', async () => {
      await service.register(userRegisterDto);

      expect(databaseService.table).toHaveBeenCalledWith('users');
      expect(databaseService.select).toHaveBeenCalledWith('id');
      expect(databaseService.where).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(databaseService.first).toHaveBeenCalledTimes(1);
      expect(databaseService.insert).toHaveBeenCalledWith({
        username: 'testuser',
        password: expect.any(String),
        age: 20,
        role_id: 1,
      });
    });

    it('should raise conflict error if username has already been used', async () => {
      jest.spyOn(databaseService, 'first').mockResolvedValue({ id: 1 });

      await expect(service.register(userRegisterDto)).rejects.toThrow(
        'Username has already been used!',
      );
      expect(databaseService.insert).not.toHaveBeenCalled();
    });
  });
});
