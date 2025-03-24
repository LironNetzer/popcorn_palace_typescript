import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Showtime } from './entities/showtime.entity';
import { Booking } from './entities/booking.entity';
import { MovieModule } from './movies/movie.module';
import { ShowtimeModule } from './showtimes/showtime.module';
import { BookingModule } from './booking/booking.module';

/**
 * Represents the root application module for the Popcorn Palace application.
 *
 * This module is responsible for the initialization and configuration of all the
 * core modules required by the application, including database connection.
 *
 * The TypeORM module is configured to connect to a PostgreSQL database with the
 * specified credentials and settings.
 *
 * Modules imported:
 * - MovieModule: Provides functionality related to movie management.
 * - ShowtimeModule: Handles showtime schedules and related operations.
 * - BookingModule: Manages bookings for movies and associated operations.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({ // to enable TypeORM services globally in the code
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      autoLoadEntities: true,
      entities: [Movie, Showtime, Booking],
      synchronize: true,
    }),
    MovieModule,
    ShowtimeModule,
    BookingModule,
  ],
})
export class AppModule {
}
