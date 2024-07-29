import { CreateTicketDto } from '../../../src/movies/tickets/dto/create-ticket.dto';
import { TicketDto } from '../../../src/movies/tickets/dto/ticket.dto';

export const createTicketDto: CreateTicketDto = {
  session_id: 1,
};

export const tickets: TicketDto[] = [
  {
    id: 1,
    movie_name: 'Movie',
    session: {
      id: 1,
      room_id: 1,
      time_slot_id: 1,
      date: '2021-01-01',
    },
  },
  {
    id: 2,
    movie_name: 'Movie 2',
    session: {
      id: 2,
      room_id: 2,
      time_slot_id: 2,
      date: '2021-01-02',
    },
  },
];
