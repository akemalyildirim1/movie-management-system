import 'reflect-metadata';

import { plainToInstance, Type } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  @Type(() => Number)
  PORT: number = 8000;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsNumber()
  @Type(() => Number)
  DB_PORT: string;

  @IsString()
  JWT_SECRET: string;
}

/**
 * Validate environment variables.
 *
 * @param environmentVariable Environment variables.
 * @returns Validated environment variables.
 * @throws Error if validation fails.
 */
export function validateEnvironmentVariables(
  environmentVariable: Record<string, string>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    environmentVariable,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation error: ${errors.toString()}`);
  }

  return validatedConfig;
}
