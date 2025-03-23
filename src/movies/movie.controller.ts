import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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

  // @Post('update')
  // @HttpCode(200) //todo - make sure it's working
  // findMovie(title: string, @Body() updateMovieDto: UpdateMovieDto): Promise<Movie | null> {
  //   return this.movieService.findMovie(title, updateMovieDto);
  // }

  @Delete(':movieTitle')
  async remove(@Param('movieTitle') title: string): Promise<void> {
    await this.movieService.remove(title);
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe()) // Enables validation
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.createMovie(createMovieDto);
  }
}
