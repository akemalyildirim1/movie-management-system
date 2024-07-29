import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Name of the room',
    example: 'Room 1',
  })
  @IsString()
  name: string;
}
