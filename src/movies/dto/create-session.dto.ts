import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { TimeSlot } from '../enum';

export class CreateSessionDto {
  @ApiProperty({
    description: 'The time slot of the session.',
    enum: TimeSlot,
  })
  @IsEnum(TimeSlot)
  time_slot_id: TimeSlot;

  @ApiProperty({
    description: 'The date of the session.',
    example: '2021-06-01',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'The room id of the session.',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  room_id: number;
}
