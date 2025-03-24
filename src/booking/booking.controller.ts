import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResponseDto, CreateBookingDto } from './booking.dto';


@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe()) // Enables validation
  async createBooking(@Body() createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    const booking = await this.bookingService.create(createBookingDto);
    return { bookingId: booking.bookingId };
  }
}


