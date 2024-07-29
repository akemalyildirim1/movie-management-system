import { configuration } from './config.configuration';

describe('configuration', () => {
  it('should return the application configuration correctly', () => {
    const expectedResult = {
      PORT: 8000,
      DB: {
        HOST: 'localhost',
        USERNAME: 'username',
        PASSWORD: 'password',
        NAME: 'postgres',
        PORT: 5432,
      },
      JWT_SECRET: 'supersecret',
    };

    const result = configuration();

    expect(result).toEqual(expectedResult);
  });
});
