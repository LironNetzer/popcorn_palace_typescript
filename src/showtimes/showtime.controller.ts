import { Controller, Get } from '@nestjs/common';
import { Showtime } from './showtime.entity';
import { ShowtimeService } from './showtime.service';


@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {
  }

  @Get() findAll(): Promise<Showtime[]> {
    return this.showtimeService.findAll();
  }

}
