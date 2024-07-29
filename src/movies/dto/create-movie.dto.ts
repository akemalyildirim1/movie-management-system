import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CreateSessionDto } from './create-session.dto';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The name of the movie.',
    example: 'The Lord of the Rings',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The age restriction of the movie.',
    example: 18,
  })
  @IsPositive()
  age_restriction: number;

  @ApiProperty({
    description: 'The list of sessions for the movie.',
    type: CreateSessionDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDto)
  sessions: CreateSessionDto[];
}
