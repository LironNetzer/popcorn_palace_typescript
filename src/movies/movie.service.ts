import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';

/**
 * Service responsible for managing Movie-related operations.
 * Provides methods to perform CRUD operations on movies.
 */
@Injectable()
export class MovieService {
  /**
   * Constructor for initializing the MovieService with the given repository.
   *
   * @param {Repository<Movie>} movieRepository - The repository used for
   * managing Movie entities.
   */
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  /**
   * Retrieves all movies stored in the repository.
   *
   * @return {Promise<Movie[]>} A promise that resolves to an array of
   * Movie objects.
   */
  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  /**
   * Retrieves a movie by its unique identifier.
   *
   * @param {number} movieId - The unique identifier of the movie to be
   * retrieved.
   * @return {Promise<Movie>} A promise that resolves to the movie object if
   * found, or null if not found.
   */
  async findById(movieId: number): Promise<Movie> {
    return this.movieRepository.findOne({ where: { id: movieId } });
  }

  /**
   * Creates a new movie record in the database if a movie with the same title does not already exist.
   *
   * @param {CreateMovieDto} createMovieDto - An object containing details of the movie to be created.
   * @return {Promise<Movie>} A promise that resolves with the newly created movie instance.
   * @throws {BadRequestException} If a movie with the given title already exists.
   */
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    // check if there is already a movie with this name (in general a title
    // isn't unique for a movie, but because the update function is by a movie
    // title, it won't be consistent to allow two entities with the same name
    const existingMovie: Movie = await this.movieRepository.findOne({
      where: { title: createMovieDto.title },
    });
    if (existingMovie) {
      throw new BadRequestException(
        `Movie with the title ${createMovieDto.title} already exists.`,
      );
    }

    const newMovie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(newMovie);
  }

  /**
   * Finds a movie by its title.
   *
   * @param {string} title - The title of the movie to search for.
   * @return {Promise<Movie>} A promise that resolves to the movie with the specified title.
   * @throws {NotFoundException} If no movie with the given title is found.
   */
  async findByTitle(title: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { title: title },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with the title ${title} doesnt exist`);
    }
    return movie;
  }

  /**
   * Updates an existing movie's details based on the provided movie title
   * and update data.
   *
   * @param {string} movieTitle - The title of the movie to update.
   * @param {UpdateMovieDto} updateMovieDto - An object containing the updated
   * movie details including title, genre, duration, rating, and release year.
   * @return {Promise<void>} Resolves when the movie has been successfully
   * updated or throws an error if the movie is not found.
   * @throws {NotFoundException} If the movie with the specified title is
   * not found.
   */
  async update(
    movieTitle: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<void> {
    const movieToUpdate = await this.movieRepository.findOne({
      where: { title: movieTitle },
    });
    if (!movieToUpdate) {
      throw new NotFoundException('Movie not found');
    }

    movieToUpdate.title = updateMovieDto.title;
    movieToUpdate.genre = updateMovieDto.genre;
    movieToUpdate.duration = updateMovieDto.duration;
    movieToUpdate.rating = updateMovieDto.rating;
    movieToUpdate.releaseYear = updateMovieDto.releaseYear;

    await this.movieRepository.save(movieToUpdate);
  }

  /**
   * Removes a movie from the repository based on its title.
   *
   * @param {string} title - The title of the movie to be removed.
   * @return {Promise<void>} A promise that resolves when the movie is
   * successfully removed.
   */
  async remove(title: string): Promise<void> {
    const movie = await this.findByTitle(title);
    await this.movieRepository.remove(movie);
  }
}
