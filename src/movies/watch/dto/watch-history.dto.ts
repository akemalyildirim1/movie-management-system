import { IsDateString, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class WatchHistoryDto {
  @ApiProperty({
    example: 'The Shawshank Redemption',
    description: 'The name of the movie.',
  })
  @IsString()
  movie_name: string;

  @ApiProperty({
    example: '2024-01-03T10:15:30Z',
    description: 'The date and time when the movie was watched.',
  })
  @IsDateString()
  watched_at: string;
}
