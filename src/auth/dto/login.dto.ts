import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user to login.',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user to login.',
  })
  @IsString()
  password: string;
}
