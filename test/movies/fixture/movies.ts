import { CreateMovieDto } from '../../../src/movies/dto/create-movie.dto';
import { MovieDto } from '../../../src/movies/dto/movie.dto';

export const movies: { [key: number]: MovieDto } = {
  1: {
    id: 1,
    name: 'Movie 1',
    age_restriction: 8,
    sessions: [
      {
        id: 1,
        date: '2024-01-03',
        room_id: 1,
        time_slot_id: 1,
      },
      {
        id: 2,
        date: '2024-01-03',
        room_id: 2,
        time_slot_id: 2,
      },
    ],
  },
  2: {
    id: 2,
    name: 'Movie 2',
    age_restriction: 18,
    sessions: [
      {
        id: 3,
        date: '2024-01-03',
        room_id: 1,
        time_slot_id: 1,
      },
    ],
  },
};

export const createMovieDto: CreateMovieDto = {
  name: 'Inception',
  age_restriction: 13,
  sessions: [
    {
      time_slot_id: 1,
      date: '2024-01-03',
      room_id: 1,
    },
    {
      time_slot_id: 2,
      date: '2024-01-03',
      room_id: 1,
    },
  ],
};
