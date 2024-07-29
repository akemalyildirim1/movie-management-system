import { Test, TestingModule } from '@nestjs/testing';

import { rooms } from '../../test/rooms/fixture/rooms';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: {
            create: jest.fn().mockResolvedValue(null),
            findAll: jest.fn().mockResolvedValue(rooms),
            findOne: jest.fn().mockResolvedValue(rooms[0]),
            update: jest.fn().mockResolvedValue(null),
            remove: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create function of service correctly', async () => {
      const createRoomDto = {
        name: 'Room 1',
      };
      await controller.create(createRoomDto);

      expect(service.create).toHaveBeenCalledWith(createRoomDto);
    });
  });

  describe('findAll', () => {
    it('should call findAll function of service correctly', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(rooms);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne function of service correctly', async () => {
      const id = '1';
      const result = await controller.findOne(id);
      expect(result).toEqual(rooms[0]);

      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call update function of service correctly', async () => {
      const id = '1';
      const updateRoomDto = {
        name: 'Room 2',
      };
      await controller.update(id, updateRoomDto);

      expect(service.update).toHaveBeenCalledWith(+id, updateRoomDto);
    });
  });

  describe('remove', () => {
    it('should call remove function of service correctly', async () => {
      const id = '1';
      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
