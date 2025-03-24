import { Module } from '@nestjs/common';
import { Showtime } from '../entities/showtime.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { MovieModule } from '../movies/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    MovieModule, //todo - erase?
  ],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
  exports: [ShowtimeService],
})
export class ShowtimeModule {
}