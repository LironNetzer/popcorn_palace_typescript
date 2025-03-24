import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';

/**
 * Controller for managing movie-related operations.
 */
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * Fetches and returns a promise containing an array of all movies.
   *
   * @return {Promise<Movie[]>} A promise that resolves to an array of
   * Movie objects.
   */
  @Get('all')
  async findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  /**
   * Creates a new movie record based on the provided data.
   *
   * @param {CreateMovieDto} createMovieDto - The DTO containing movie details.
   * @return {Promise<Movie>} A promise that resolves to the created movie object.
   */
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe()) // Enables validation
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  /**
   * Updates the details of an existing movie using the provided movie title
   * and update data.
   *
   * @param {string} movieTitle - The title of the movie to be updated.
   * @param {UpdateMovieDto} updateMovieDto - An object containing the
   * updated movie details.
   * @return {Promise<void>} A promise that resolves when the movie update
   * operation is completed.
   */
  @Post('update/:movieTitle')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<void> {
    return this.movieService.update(movieTitle, updateMovieDto);
  }

  /**
   * Deletes a movie with the given title.
   *
   * @param {string} movieTitle - The title of the movie to delete.
   * @return {Promise<void>} A promise that resolves when the movie is
   * successfully deleted.
   */
  @Delete(':movieTitle')
  async deleteMovie(@Param('movieTitle') movieTitle: string): Promise<void> {
    await this.movieService.remove(movieTitle);
  }
}
