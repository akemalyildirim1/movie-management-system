import { IsInt } from 'class-validator';

import { CreateSessionDto } from './create-session.dto';

export class SessionDto extends CreateSessionDto {
  @IsInt()
  id: number;
}
