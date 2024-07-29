import { CreateWatchDto } from '../../../src/movies/watch/dto/create-watch.dto';
import { WatchHistoryDto } from '../../../src/movies/watch/dto/watch-history.dto';

export const createWatchDto: CreateWatchDto = {
  ticket_id: 1,
};

export const watchHistoryArray: WatchHistoryDto[] = [
  {
    movie_name: 'The Shawshank Redemption',
    watched_at: '2021-10-10',
  },
  {
    movie_name: 'The Godfather',
    watched_at: '2022-10-10',
  },
  {
    movie_name: 'The Dark Knight',
    watched_at: '2023-10-10',
  },
];
