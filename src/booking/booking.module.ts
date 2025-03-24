import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from '../entities/booking.entity';
import { ShowtimeModule } from '../showtimes/showtime.module';

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