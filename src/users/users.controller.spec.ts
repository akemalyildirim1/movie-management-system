import { Test, TestingModule } from '@nestjs/testing';

import { UserRegisterDto } from './dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const userRegisterDto: UserRegisterDto = {
      username: 'testuser',
      password: 'password',
      age: 20,
      role_id: 2,
    };

    it('should call register function of service correctly', async () => {
      await controller.register(userRegisterDto);

      expect(service.register).toHaveBeenCalledWith(userRegisterDto);
    });
  });
});
