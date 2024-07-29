import { Test, TestingModule } from '@nestjs/testing';

import { tokenPayload } from '../../../test/auth/fixture/tokenPayload';
import { createTicketDto, tickets } from '../../../test/movies/fixture/tickets';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: {
            create: jest.fn().mockResolvedValue(null),
            findAll: jest.fn().mockResolvedValue(tickets),
            findOne: jest.fn().mockResolvedValue(tickets[0]),
            remove: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the correct service function', async () => {
      await controller.create(createTicketDto, tokenPayload);

      expect(service.create).toHaveBeenCalledWith(createTicketDto, 99);
    });
  });

  describe('findAll', () => {
    it('should call the correct service function', async () => {
      await controller.findAll(tokenPayload);

      expect(service.findAll).toHaveBeenCalledWith(99);
    });
  });

  describe('findOne', () => {
    it('should call the correct service function', async () => {
      await controller.findOne(tokenPayload, '15');

      expect(service.findOne).toHaveBeenCalledWith(99, 15);
    });
  });

  describe('remove', () => {
    it('should call the correct service function', async () => {
      await controller.remove(tokenPayload, '15');

      expect(service.remove).toHaveBeenCalledWith(99, 15);
    });
  });
});
