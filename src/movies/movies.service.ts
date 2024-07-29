import { Knex } from 'knex';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { DATABASE_SERVICE } from '../common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { MovieDto } from './dto/movie.dto';
import { SessionDto } from './dto/session.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieNotFoundException } from './movies.exception';

type Session = {
  movie_id: number;
  time_slot_id: number;
  date: string;
  room_id: number;
};

@Injectable()
export class MoviesService {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseService: Knex,
  ) {}

  /**
   * Create a movie in the database.
   *
   * @param createMovieDto The movie data to create.
   * @throws BadRequestException If the room IDs are invalid.
   * @throws ConflictException If there is a conflict in the sessions.
   */
  async create(createMovieDto: CreateMovieDto): Promise<void> {
    const { name, age_restriction, sessions } = createMovieDto;

    await this.databaseService.transaction(async (trx) => {
      await this.validateRooms(trx, sessions);

      // Insert the movie and get the generated ID
      const [{ id: movieId }] = await trx
        .table('movies')
        .insert({ name, age_restriction })
        .returning('id');

      await this.insertSessionsToDB(trx, sessions, movieId);
    });
  }

  /**
   * Get all movies from the database.
   *
   * @returns The movies fetched from the database.
   * @throws MovieNotFoundException If no movies are found.
   */
  async findAll(): Promise<MovieDto[]> {
    return this.getMoviesFromDB();
  }

  /**
   * Get a movie from the database.
   *
   * @param movieId The ID of the movie to fetch.
   * @returns The movie fetched from the database.
   * @throws MovieNotFoundException If the movie with the provided ID is not found.
   */
  async findOne(movieId: number): Promise<MovieDto> {
    return (await this.getMoviesFromDB(movieId))[0];
  }

  /**
   * Update a movie in the database.
   *
   * @param movieId The ID of the movie to update.
   * @param updateMovieDto The updated movie data.
   * @throws MovieNotFoundException If the movie with the provided ID is
   *    not found.
   */
  async update(movieId: number, updateMovieDto: UpdateMovieDto) {
    await this.databaseService.transaction(async (trx) => {
      // Firstly update the movie table.
      const updatedRowId: { id: number }[] = await trx
        .table('movies')
        .update({
          name: updateMovieDto.name,
          age_restriction: updateMovieDto.age_restriction,
        })
        .where('id', movieId)
        .returning('id');

      if (updatedRowId.length === 0) {
        throw new MovieNotFoundException();
      }

      // Clear the existing sessions for the movie.
      await trx.table('movies_sessions').where('movie_id', movieId).del();

      // Validate the sessions and insert them.
      await this.validateRooms(trx, updateMovieDto.sessions);

      // Insert the sessions for the movie
      await this.insertSessionsToDB(trx, updateMovieDto.sessions, movieId);
    });
  }

  /**
   * Remove a movie from the database.
   *
   * @param movieId The ID of the movie to remove.
   * @throws MovieNotFoundException If the movie with the provided ID is not found.
   */
  async remove(movieId: number) {
    const updatedRowId: { id: number }[] = await this.databaseService
      .table('movies')
      .where('id', movieId)
      .del(['id']);

    if (updatedRowId.length === 0) {
      throw new MovieNotFoundException();
    }
  }

  /**
   * Validate the rooms by checking if the room IDs are valid.
   *
   * @param trx The database transaction object.
   * @param sessions The sessions to validate.
   * @throws BadRequestException If the room IDs are invalid.
   */
  private async validateRooms(
    trx: Knex.Transaction,
    sessions: CreateSessionDto[],
  ): Promise<void> {
    const roomIds: Set<number> = new Set();
    sessions.forEach((session) => roomIds.add(session.room_id));

    const rooms: { id: number }[] = await trx
      .table('rooms')
      .whereIn('id', Array.from(roomIds))
      .where('is_active', true)
      .select('id');

    if (rooms.length !== roomIds.size) {
      throw new BadRequestException('Invalid room IDs provided');
    }
  }

  /**
   * Insert the sessions to the database.
   *
   * @param trx The database transaction object.
   * @param sessions The movie's sessions to insert.
   * @param movieId The ID of the movie to insert the sessions for.
   * @throws ConflictException If there is a conflict in the sessions.
   */
  private async insertSessionsToDB(
    trx: Knex.Transaction,
    sessions: CreateSessionDto[],
    movieId: number,
  ): Promise<void> {
    try {
      const sessionInserts: Session[] = sessions.map((session: SessionDto) => ({
        movie_id: movieId,
        time_slot_id: session.time_slot_id,
        date: session.date,
        room_id: session.room_id,
      }));

      await trx.table('movies_sessions').insert(sessionInserts);
    } catch (error) {
      // If there is a conflict, throw a ConflictException
      throw new ConflictException('The provided sessions are conflicting');
    }
  }

  /**
   * Get movies from the database.
   *
   * @param movieId The ID of the movie to fetch. If not
   *    provided, all movies will be fetched.
   * @returns The movies fetched from the database.
   * @throws MovieNotFoundException If the movie with the
   *    provided ID is not found.
   */
  private async getMoviesFromDB(
    movieId: number | undefined = undefined,
  ): Promise<MovieDto[]> {
    const filterStatement: {
      movie_id?: number;
    } = movieId ? { movie_id: movieId } : {};

    const queryResult: {
      movie_id: number;
      name: string;
      age_restriction: number;
      date: string;
      session_id: number;
      room_id: number;
      time_slot_id: number;
    }[] = await this.databaseService
      .table('movies')
      .join('movies_sessions', 'movies.id', 'movies_sessions.movie_id')
      .select(
        'movies.id as movie_id',
        'movies.name',
        'movies.age_restriction',
        'movies_sessions.id as session_id',
        'movies_sessions.date as date',
        'movies_sessions.room_id',
        'movies_sessions.time_slot_id',
      )
      .where(filterStatement);

    if (queryResult.length === 0) {
      throw new MovieNotFoundException();
    }

    const movies: Map<number, MovieDto> = new Map();

    queryResult.forEach((row) => {
      if (!movies.has(row.movie_id)) {
        movies.set(row.movie_id, {
          id: row.movie_id,
          name: row.name,
          age_restriction: row.age_restriction,
          sessions: [],
        });
      }

      const movie = movies.get(row.movie_id);

      movie.sessions.push({
        id: row.session_id,
        date: row.date,
        time_slot_id: row.time_slot_id,
        room_id: row.room_id,
      });
    });

    return Array.from(movies.values());
  }
}
