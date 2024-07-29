import * as bcrypt from 'bcryptjs';
import { Knex } from 'knex';

import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { DATABASE_SERVICE } from '../common';
import { UserRegisterDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_SERVICE) private readonly knex: Knex) {}

  /**
   * Register a new user.
   *
   * @param userRegisterDto User registration data.
   * @throws ConflictException If the username is already taken.
   */
  public async register(userRegisterDto: UserRegisterDto): Promise<void> {
    await this.validateRegistration(userRegisterDto.username);
    await this.createUser(userRegisterDto);
  }

  /**
   * Validate if the username is already taken.
   *
   * @param username Unique username.
   * @throws ConflictException If the username is already taken.
   */
  private async validateRegistration(username: string): Promise<void> {
    const user: { id: number } | undefined = await this.knex
      .table('users')
      .select('id')
      .where({ username })
      .first();

    if (user) {
      throw new ConflictException('Username has already been used!');
    }
  }

  /**
   * Create a new user in the database.
   *
   * @param userRegisterDto User registration data.
   */
  private async createUser(userRegisterDto: UserRegisterDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(userRegisterDto.password, 10);
    await this.knex
      .table('users')
      .insert({ ...userRegisterDto, password: hashedPassword });
  }
}
