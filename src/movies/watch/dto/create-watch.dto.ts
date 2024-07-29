import { IsInt, IsPositive } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateWatchDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the ticket.',
  })
  @IsInt()
  @IsPositive()
  ticket_id: number;
}
