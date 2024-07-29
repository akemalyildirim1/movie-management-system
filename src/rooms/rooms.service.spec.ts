import { Knex } from 'knex';

import { Test, TestingModule } from '@nestjs/testing';

import { mockDatabaseService } from '../../test/mocks/database-service.mock';
import { DATABASE_SERVICE } from '../common';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let service: RoomsService;
  let databaseService: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, mockDatabaseService],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    databaseService = module.get<Knex>(DATABASE_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRoomDto = {
      name: 'testroom',
    };
    it('should insert room to database', async () => {
      await service.create(createRoomDto);

      expect(databaseService.table).toHaveBeenCalledWith('rooms');
      expect(databaseService.insert).toHaveBeenCalledWith(createRoomDto);
    });
  });

  describe('findAll', () => {
    const rooms = [
      {
        id: 1,
        name: 'testroom',
      },
    ];
    it('should return rooms from database', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValue(rooms);
      const result = await service.findAll();
      expect(result).toEqual(rooms);

      expect(databaseService.table).toHaveBeenCalledWith('rooms');
      expect(databaseService.select).toHaveBeenCalledWith('id', 'name');
    });

    it('should throw NotFoundException if no rooms are found', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow('Room not found!');
    });
  });

  describe('findOne', () => {
    const room = {
      id: 1,
      name: 'testroom',
    };
    it('should return room from database', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValue([room]);

      const result = await service.findOne(room.id);
      expect(result).toEqual(room);

      expect(databaseService.table).toHaveBeenCalledWith('rooms');
      expect(databaseService.select).toHaveBeenCalledWith('id', 'name');
      expect(databaseService.where).toHaveBeenCalledWith({
        id: room.id,
        is_active: true,
      });
    });

    it('should throw NotFoundException if the room is not found', async () => {
      jest.spyOn(databaseService, 'select').mockResolvedValue([]);
      await expect(service.findOne(room.id)).rejects.toThrow('Room not found!');
    });
  });

  describe('update', () => {
    const roomId = 1;
    const updateRoomDto = {
      name: 'updatedroom',
    };

    it('should update room in database', async () => {
      jest.spyOn(databaseService, 'returning').mockResolvedValue([roomId]);

      await service.update(roomId, updateRoomDto);

      expect(databaseService.table).toHaveBeenCalledWith('rooms');
      expect(databaseService.update).toHaveBeenCalledWith(updateRoomDto);
      expect(databaseService.where).toHaveBeenCalledWith('id', roomId);
      expect(databaseService.where).toHaveBeenCalledWith('is_active', true);
    });

    it('should throw NotFoundException if the room is not found', async () => {
      jest.spyOn(databaseService, 'returning').mockResolvedValue([]);

      await expect(service.update(roomId, updateRoomDto)).rejects.toThrow(
        'Room not found!',
      );
    });
  });

  describe('remove', () => {
    const roomId = 1;

    it('should remove room from database', async () => {
      jest.spyOn(databaseService, 'returning').mockResolvedValue([roomId]);

      await service.remove(roomId);

      expect(databaseService.table).toHaveBeenCalledWith('rooms');
      expect(databaseService.update).toHaveBeenCalledWith({ is_active: false });
      expect(databaseService.where).toHaveBeenCalledWith('id', roomId);
      expect(databaseService.where).toHaveBeenCalledWith('is_active', true);
    });

    it('should throw NotFoundException if the room is not found', async () => {
      jest.spyOn(databaseService, 'returning').mockResolvedValue([]);

      await expect(service.remove(roomId)).rejects.toThrow('Room not found!');
    });
  });
});
