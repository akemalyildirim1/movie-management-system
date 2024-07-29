import { NotFoundException } from '@nestjs/common';

export class SessionNotFoundException extends NotFoundException {
  constructor() {
    super('Session not found!');
  }
}

export class TicketNotFoundException extends NotFoundException {
  constructor() {
    super('Ticket not found!');
  }
}
