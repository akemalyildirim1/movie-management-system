import * as bcryptjs from 'bcryptjs';
import { Knex } from 'knex';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DATABASE_SERVICE, UserRole } from '../common';
import { TokenPayload } from '../common/interfaces';
import { AccessToken, LoginDto } from './dto';

type User = {
  id: number;
  username: string;
  password: string;
  role_id: number;
};

@Injectable()
export class AuthService {
  private readonly loginErrorMessage: string = 'Invalid email or password!';

  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: Knex,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login the user.
   *
   * @param username Username to check.
   * @param password Password to check.
   * @returns JWT token and token type.
   * @throws UnauthorizedException If the user does not exist or the
   *    password is incorrect.
   */
  async login({ username, password }: LoginDto): Promise<AccessToken> {
    const user: User = await this.getUserInfoByUsername(username);
    await this.checkPassword(password, user.password);
    return this.generateJwtToken(user);
  }

  /**
   * Get user information by filtering the username.
   *
   * @param username Username to filter.
   * @returns User information.
   * @throws UnauthorizedException If the user does not exist.
   */
  private async getUserInfoByUsername(username: string): Promise<User> {
    const user: User | undefined = await this.databaseService
      .table('users')
      .select('id', 'username', 'password', 'role_id')
      .where({ username })
      .first();

    if (!user) {
      throw new UnauthorizedException(this.loginErrorMessage);
    }

    return user;
  }

  /**
   * Check if the password is correct.
   *
   * @param password Password to check.
   * @param hashedPassword Hashed password from database.
   * @throws UnauthorizedException If the password is incorrect.
   */
  private async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isValid = await bcryptjs.compare(password, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException(this.loginErrorMessage);
    }
  }

  /**
   * Generate JWT token for the user.
   *
   * @param user User information.
   * @returns JWT token and token type.
   */
  private async generateJwtToken(user: User): Promise<AccessToken> {
    const payload: TokenPayload = {
      userId: user.id,
      roleId: user.role_id as UserRole,
    };

    return {
      token_type: 'Bearer',
      token: await this.jwtService.signAsync(payload),
    };
  }
}
