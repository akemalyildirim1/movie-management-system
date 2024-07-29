import { UserRole } from '../index';

export interface TokenPayload {
  userId: number;
  roleId: UserRole;
}
