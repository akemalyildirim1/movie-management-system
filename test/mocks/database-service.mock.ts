import { DATABASE_SERVICE } from '../../src/common';
import { Knex } from 'knex';

const createMockKnexInstance = (): Partial<Knex> => {
  const mockInstance: Partial<Knex> = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      // Create a clone of the mockInstance for the transaction context
      const trxInstance = { ...mockInstance };
      await callback(trxInstance);
      return Promise.resolve(trxInstance);
    }),
    table: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    whereIn: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(null),
    join: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(null),
  };

  return mockInstance;
};

export const mockDatabaseService = {
  provide: DATABASE_SERVICE,
  useValue: createMockKnexInstance(),
};
