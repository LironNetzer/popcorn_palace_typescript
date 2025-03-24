import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from '../entities/booking.entity';
import { ShowtimeModule } from '../showtimes/showtime.module';

/**
 * The BookingModule is responsible for managing booking-related functionalities in the application.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ShowtimeModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {
}