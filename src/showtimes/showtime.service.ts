import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
import { MovieService } from '../movies/movie.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtime.dto';


@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    private movieService: MovieService, // todo - why?
  ) {
  }

  async findById(showtimeId: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    if (!showtime) {
      throw new HttpException(`Showtime with id ${showtimeId} not found`, HttpStatus.NOT_FOUND);
    }
    return showtime;
  }

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    // verify the movie exists
    const movie = await this.movieService.findById(createShowtimeDto.movieId);
    if (!movie) {
      throw new HttpException(`Movie with id ${createShowtimeDto.movieId} not found`, HttpStatus.NOT_FOUND); //todo ? not found or somethinhg else?
    } //todo - earse after I finished the relations

    // Check for overlapping showtimes in the same theater
    const hasOverlap = await this.isTheatreFree(
      createShowtimeDto.theater,
      createShowtimeDto.startTime,
      createShowtimeDto.endTime,
    );
    if (hasOverlap) {
      throw new HttpException(`This theatre is occupied in the relevant time frame`, HttpStatus.BAD_REQUEST);
    }

    // Validate start time is before end time
    if (createShowtimeDto.startTime >= createShowtimeDto.endTime) {
      throw new HttpException('Start time must be before end time', HttpStatus.BAD_REQUEST);
    }

    const showtime = this.showtimeRepository.create(createShowtimeDto);
    return this.showtimeRepository.save(showtime);
  }

  async update(showtimeId: number, @Body() updateShowtimeDto: UpdateShowtimeDto): Promise<void> {
    // verify the showtime exists
    const showtimeToUpdate = await this.findById(showtimeId);

    // Check for overlapping showtimes in the same theater (except the showtime itself)
    const hasOverlap = await this.isTheatreFree(
      updateShowtimeDto.theater,
      updateShowtimeDto.startTime,
      updateShowtimeDto.endTime,
      showtimeId,
    );
    if (hasOverlap) {
      throw new HttpException(`This theatre is occupied in the relevant time frame`, HttpStatus.BAD_REQUEST);
    }

    // update the showtime
    showtimeToUpdate.price = updateShowtimeDto.price;
    showtimeToUpdate.theater = updateShowtimeDto.theater;
    showtimeToUpdate.startTime = updateShowtimeDto.startTime;
    showtimeToUpdate.endTime = updateShowtimeDto.endTime;
    showtimeToUpdate.movieId = updateShowtimeDto.movieId;
    await this.showtimeRepository.save(showtimeToUpdate);

  }

  async delete(showtimeId: number): Promise<void> {
    const showtime = await this.findById(showtimeId);
    await this.showtimeRepository.remove(showtime);
  }

  private async isTheatreFree(
    theater: string,
    startTime: Date,
    endTime: Date,
    excludeId?: number,
  ): Promise<Boolean> {
    const queryBuilder = this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.theater = :theater', { theater })
      .andWhere(
        '(showtime.startTime < :endTime AND showtime.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeId) {
      queryBuilder.andWhere('showtime.id != :excludeId', { excludeId });
    }

    const overlappingShowtimes = await queryBuilder.getMany();

    return overlappingShowtimes.length > 0;

  }
}
