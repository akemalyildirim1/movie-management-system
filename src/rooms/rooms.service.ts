import { Knex } from 'knex';

import { Inject, Injectable } from '@nestjs/common';

import { DATABASE_SERVICE } from '../common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto, Rooms } from './dto/room.dto';
import { RoomNotFoundException } from './rooms.exception';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: Knex,
  ) {}

  /**
   * Create a new room in the database.
   *
   * @param createRoomDto The room data.
   */
  async create(createRoomDto: CreateRoomDto): Promise<void> {
    await this.databaseService.table('rooms').insert(createRoomDto);
  }

  /**
   * Get all rooms from the database.
   *
   * @returns The rooms.
   * @throws NotFoundException if no rooms are found.
   */
  async findAll(): Promise<Rooms> {
    return this.getRoomsFromDB();
  }

  /**
   * Get a room by ID from the database.
   *
   * @param roomId The room ID to search.
   * @returns The room.
   * @throws NotFoundException if the room is not found.
   */
  async findOne(roomId: number): Promise<RoomDto> {
    return (await this.getRoomsFromDB(roomId))[0];
  }

  /**
   * Update a room in the database.
   *
   * @param roomId Room ID to update.
   * @param updateRoomDto The updated room data.
   * @throws NotFoundException if the room is not found.
   */
  async update(roomId: number, updateRoomDto: CreateRoomDto): Promise<void> {
    const updatedRowId: number[] = await this.databaseService
      .table('rooms')
      .where('id', roomId)
      .where('is_active', true)
      .update(updateRoomDto)
      .returning('id');

    if (updatedRowId.length === 0) {
      throw new RoomNotFoundException();
    }
  }

  /**
   * Remove a room from the database.
   *
   * @param roomId The room ID to remove.
   * @throws NotFoundException if the room is not found.
   */
  async remove(roomId: number) {
    const updatedRowId: number[] = await this.databaseService
      .table('rooms')
      .where('id', roomId)
      .where('is_active', true)
      .update({
        is_active: false,
      })
      .returning('id');

    if (updatedRowId.length === 0) {
      throw new RoomNotFoundException();
    }
  }

  /**
   * Get rooms from the database.
   *
   * @param roomId The room ID to search.
   * @returns The rooms info.
   * @throws NotFoundException if no rooms are found.
   */
  private async getRoomsFromDB(
    roomId: number | undefined = undefined,
  ): Promise<Rooms> {
    const filterObject = { is_active: true };
    if (roomId) {
      filterObject['id'] = roomId;
    }

    const queryResult: Rooms = await this.databaseService
      .table('rooms')
      .where(filterObject)
      .select('id', 'name');

    if (queryResult.length === 0) {
      throw new RoomNotFoundException();
    }

    return queryResult;
  }
}
