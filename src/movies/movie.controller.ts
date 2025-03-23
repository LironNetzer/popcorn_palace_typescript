import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

// A basic controller with a single route.

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {
  }

  @Get() findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Get(':id') findMovie(id: number): Promise<Movie | null> {
    return this.movieService.findMovie(id);
  }

  @Post()
  @UsePipes(new ValidationPipe()) // Enables validation
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.createMovie(createMovieDto);
  }
}
