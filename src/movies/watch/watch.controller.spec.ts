import { Test, TestingModule } from '@nestjs/testing';

import { tokenPayload } from '../../../test/auth/fixture/tokenPayload';
import {
  createWatchDto,
  watchHistoryArray,
} from '../../../test/movies/fixture/watch';
import { WatchController } from './watch.controller';
import { WatchService } from './watch.service';

describe('WatchController', () => {
  let controller: WatchController;
  let service: WatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      providers: [
        {
          provide: WatchService,
          useValue: {
            create: jest.fn().mockResolvedValue(null),
            getWatchHistory: jest.fn().mockResolvedValue(watchHistoryArray),
          },
        },
      ],
    }).compile();

    controller = module.get<WatchController>(WatchController);
    service = module.get<WatchService>(WatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call watchService.create with correct arguments', async () => {
      await controller.create(tokenPayload, createWatchDto);

      expect(service.create).toHaveBeenCalledWith(
        tokenPayload.userId,
        createWatchDto,
      );
    });
  });

  describe('getWatchHistory', () => {
    it('should call watchService.getWatchHistory with correct arguments', async () => {
      await controller.getWatchHistory(tokenPayload);

      expect(service.getWatchHistory).toHaveBeenCalledWith(tokenPayload.userId);
    });
  });
});
