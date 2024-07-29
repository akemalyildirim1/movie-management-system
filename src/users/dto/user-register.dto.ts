import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../../common';

export class UserRegisterDto {
  @ApiProperty({
    description: 'The username of the User',
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    description: 'The password of the User',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'The age of the User',
  })
  @IsPositive()
  @IsInt()
  age: number;

  @ApiProperty({
    description: 'The role of the User',
    type: Number,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role_id: UserRole;
}
