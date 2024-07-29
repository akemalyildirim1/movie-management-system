import { NotFoundException } from '@nestjs/common';

export class RoomNotFoundException extends NotFoundException {
  constructor() {
    super('Room not found!');
  }
}
