import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service';


@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  // @Get('all') findAllMovies(): Promise<Movie[]> {
  //   return this.movieService.findAll();
  // }
  //
  // @Post()
  // @HttpCode(200)
  // @UsePipes(new ValidationPipe()) // Enables validation
  // async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
  //   return this.movieService.create(createMovieDto);
  // }
  //
  // @Post('update/:movieTitle')
  // @HttpCode(200)
  // @UsePipes(new ValidationPipe()) // Enables validation
  // updateMovie(@Param('movieTitle') movieTitle: string, @Body() updateMovieDto: UpdateMovieDto): Promise<void> {
  //   return this.movieService.update(movieTitle, updateMovieDto);
  // }
  //
  // @Delete(':movieTitle')
  // async deleteMovie(@Param('movieTitle') movieTitle: string): Promise<void> {
  //   await this.movieService.delete(movieTitle);
  // }
}


