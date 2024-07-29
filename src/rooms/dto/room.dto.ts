import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RoomDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the room',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Room 1',
    description: 'The name of the room',
  })
  @IsString()
  name: string;
}

export type Rooms = RoomDto[];
