import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { SessionDto } from '../../dto/session.dto';

export class TicketDto {
  @ApiProperty({
    description: 'The id of the ticket',
    example: 1,
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The name of the movie',
    example: 'The Matrix',
  })
  @IsString()
  movie_name: string;

  @ApiProperty({
    description: 'The session of the ticket.',
    type: SessionDto,
  })
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  session: SessionDto;
}
