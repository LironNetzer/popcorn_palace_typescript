import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from './booking.dto';
import { ShowtimeService } from '../showtimes/showtime.service';


/**
 * Service responsible for managing booking-related operations for a cinema or event booking system.
 * This service handles functionality such as creating bookings while ensuring seat availability and showtime validity
 */
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly showtimeService: ShowtimeService,
  ) {
  }

  /**
   * Creates a new booking based on the provided booking details.
   *
   * @param {CreateBookingDto} createBookingDto - The data transfer object containing booking details such as showtime ID and seat number.
   * @return {Promise<Booking>} A promise that resolves to the newly created booking.
   * @throws {BadRequestException} Throws an error if the specified seat is already booked or if the showtime does not exist.
   */
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // verify showtime exists
    await this.showtimeService.findById(createBookingDto.showtimeId);

    // check if the relevant seat is free (based on showtimeId and seat number)
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        showtimeId: createBookingDto.showtimeId,
        seatNumber: createBookingDto.seatNumber,
      },
    });
    if (existingBooking) {
      throw new BadRequestException(`The ${createBookingDto.seatNumber} seat is already taken`);
    }

    // create the new booking
    const booking = this.bookingRepository.create(createBookingDto);
    return this.bookingRepository.save(booking);
  }
}
