import { Module } from '@nestjs/common';
import { Showtime } from './showtime.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime])],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
  exports: [ShowtimeService],
})
export class ShowtimeModule {
}