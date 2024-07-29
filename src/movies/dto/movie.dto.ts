import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { SessionDto } from './session.dto';

export class MovieDto {
  @ApiProperty({
    description: 'The unique id of the movie.',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The name of the movie.',
    example: 'The Lord of the Rings',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Age restriction of the movie',
    example: 18,
  })
  @IsPositive()
  age_restriction: number;

  @ApiProperty({
    description: 'The list of sessions for the movie.',
    type: SessionDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  sessions: SessionDto[];
}
