import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Showtime } from './entities/showtime.entity';
import { Booking } from './entities/booking.entity';
import { MovieModule } from './movies/movie.module';
import { ShowtimeModule } from './showtimes/showtime.module';
import { BookingModule } from './booking/booking.module';

// The root module of the application.

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
      synchronize: true, //todo - change
    }),
    MovieModule,
    ShowtimeModule,
    BookingModule,
  ],
})
export class AppModule {
}
