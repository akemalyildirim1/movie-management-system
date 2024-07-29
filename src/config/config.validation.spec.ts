import { validateEnvironmentVariables } from './config.validation';

describe('validateEnvironmentVariables', () => {
  it('throws an error if validation fails', () => {
    const envVariables = {
      DB_HOST: 'localhost',
      DB_PORT: '1234',
    };

    expect(() => {
      validateEnvironmentVariables(envVariables);
    }).toThrow(Error);
  });

  it('should return validated env variables if validation success', () => {
    const envVariables = {
      PORT: '8000',
      DB_HOST: 'localhost',
      DB_USERNAME: 'username',
      DB_PASSWORD: 'password',
      DB_NAME: 'postgres',
      DB_PORT: '5432',
      JWT_SECRET: 'supersecret',
    };

    const result = validateEnvironmentVariables(envVariables);
    expect(result).toEqual({ ...envVariables, PORT: 8000, DB_PORT: 5432 });
  });
});
