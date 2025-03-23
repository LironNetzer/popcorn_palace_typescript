import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';


@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {
  }

  findAll(): Promise<Showtime[]> {
    return this.showtimeRepository.find();
  }

}
