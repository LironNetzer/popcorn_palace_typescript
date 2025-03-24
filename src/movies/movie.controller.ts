import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';


// A basic controller with a single route.

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {
  }

  @Get('all') findAllMovies(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe()) // Enables validation
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Post('update/:movieTitle')
  @HttpCode(200)
  @UsePipes(new ValidationPipe()) // Enables validation
  updateMovie(@Param('movieTitle') movieTitle: string, @Body() updateMovieDto: UpdateMovieDto): Promise<void> {
    return this.movieService.update(movieTitle, updateMovieDto);
  }

  @Delete(':movieTitle')
  async deleteMovie(@Param('movieTitle') movieTitle: string): Promise<void> {
    await this.movieService.remove(movieTitle);
  }
}


