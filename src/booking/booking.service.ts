import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from './booking.dto';
import { ShowtimeService } from '../showtimes/showtime.service';


@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly showtimeService: ShowtimeService,
  ) {
  }

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
      throw new HttpException(`The ${createBookingDto.seatNumber} seat is already taken`, HttpStatus.BAD_REQUEST);
    }

    // create the new booking
    const booking = this.bookingRepository.create(createBookingDto);
    return this.bookingRepository.save(booking);
  }

}
