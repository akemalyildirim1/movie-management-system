import { IsInt } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    description: 'The session id of the ticket',
    example: 1,
  })
  @IsInt()
  session_id: number;
}
