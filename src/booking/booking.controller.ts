import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResponseDto, CreateBookingDto } from './booking.dto';

/**
 * Controller for handling booking-related operations.
 */
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  /**
   * Creates a new booking based on the provided booking data.
   *
   * @param {CreateBookingDto} createBookingDto - Data transfer object containing information required to create a booking.
   * @return {Promise<BookingResponseDto>} A promise that resolves to a BookingResponseDto containing the booking ID of the successfully created booking.
   */
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe()) // Enables validation
  async createBooking(@Body() createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    const booking = await this.bookingService.create(createBookingDto);
    return { bookingId: booking.bookingId };
  }
}


