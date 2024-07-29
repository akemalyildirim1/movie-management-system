import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
  @ApiProperty({
    description: 'The access token.',
  })
  token: string;

  @ApiProperty({
    description: 'The type of the token.',
  })
  token_type: string;
}
