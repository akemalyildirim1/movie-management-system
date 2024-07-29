import { ConflictException, ForbiddenException } from '@nestjs/common';

export class TicketAlreadyUsedException extends ConflictException {
  constructor() {
    super('You have already watched this movie.');
  }
}

export class ForbiddenTicketException extends ForbiddenException {
  constructor() {
    super("You can't use this ticket!");
  }
}
