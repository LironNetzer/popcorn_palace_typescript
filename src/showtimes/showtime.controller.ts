import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Showtime } from '../entities/showtime.entity';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './showtime.dto';

// import { CreateShowtimeDto } from sho


@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {
  }

  @Get(':showtimeId')
  findById(@Param('showtimeId', ParseIntPipe) showtimeId: number): Promise<Showtime> {
    return this.showtimeService.findById(showtimeId);
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createShowtime(@Body() createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimeService.create(createShowtimeDto);
  }

}
