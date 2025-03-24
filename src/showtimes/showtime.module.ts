import { Module } from '@nestjs/common';
import { Showtime } from '../entities/showtime.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { MovieModule } from '../movies/movie.module';


/**
 * The ShowtimeModule is a NestJS module responsible for managing the Showtime entity.
 * It integrates with the TypeOrmModule to handle database operations related to showtimes.
 * It provides the necessary services and controllers to manage showtime-related functionality.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    MovieModule,
  ],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
  exports: [ShowtimeService],
})
export class ShowtimeModule {
}