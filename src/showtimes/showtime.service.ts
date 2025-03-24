import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
import { MovieService } from '../movies/movie.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtime.dto';

/**
 * The ShowtimeService class provides methods for managing showtime-related
 * operations, such as retrieving, creating, updating, and deleting showtimes
 * in a theater system. It also validates overlapping showtimes,
 * checks theatre availability, and ensures data integrity.
 */
@Injectable()
export class ShowtimeService {
  /**
   * Creates an instance of the class.
   *
   * @param {Repository<Showtime>} showtimeRepository - The repository for accessing and managing Showtime entities.
   * @param {MovieService} movieService - The service to manage and retrieve movie data.
   */
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    private readonly movieService: MovieService,
  ) {}

  /**
   * Finds a showtime by its unique identifier.
   *
   * @param {number} showtimeId - The unique identifier of the showtime to retrieve.
   * @return {Promise<Showtime>} A promise that resolves to the found showtime object.
   * @throws {NotFoundException} If no showtime is found with the specified identifier.
   */
  async findById(showtimeId: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });
    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${showtimeId} not found`);
    }
    return showtime;
  }

  /**
   * Creates a new showtime entry in the system.
   *
   * @param {CreateShowtimeDto} createShowtimeDto - The data transfer object containing details for the new showtime, including movie ID, theater, start time, and end time.
   * @return {Promise<Showtime>} A promise that resolves to the created Showtime object.
   * @throws {NotFoundException} If the movie with the provided ID does not exist.
   * @throws {BadRequestException} If the specified theater is occupied during the given time frame or if the start time is not before the end time.
   */
  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    // verify the movie exists
    const movie = await this.movieService.findById(createShowtimeDto.movieId);
    if (!movie) {
      throw new NotFoundException(
        `Movie with id ${createShowtimeDto.movieId} not found`,
      );
    }

    // Check for overlapping showtimes in the same theater
    const hasOverlap = await this.isTheatreFree(
      createShowtimeDto.theater,
      createShowtimeDto.startTime,
      createShowtimeDto.endTime,
    );
    if (hasOverlap) {
      throw new BadRequestException(
        `This theatre is occupied in the relevant time frame`,
      );
    }

    // Validate start time is before end time
    if (createShowtimeDto.startTime >= createShowtimeDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const showtime = this.showtimeRepository.create(createShowtimeDto);
    return this.showtimeRepository.save(showtime);
  }

  /**
   * Updates the details of an existing showtime identified by its ID. This includes updating
   * the showtime's theater, price, start time, end time, and the associated movie.
   * Ensures that the theater is available in the specified time frame before proceeding with the update.
   *
   * @param {number} showtimeId - The unique identifier of the showtime to update.
   * @param {UpdateShowtimeDto} updateShowtimeDto - The data transfer object containing updated
   *        information about the showtime, such as theater, price, start time, end time, and movie ID.
   * @return {Promise<void>} A promise that resolves when the update is successfully completed.
   *         Throws a BadRequestException if the theater is occupied during the relevant time frame.
   */
  async update(
    showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<void> {
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
      throw new BadRequestException(
        `This theatre is occupied in the relevant time frame`,
      );
    }

    // update the showtime
    showtimeToUpdate.price = updateShowtimeDto.price;
    showtimeToUpdate.theater = updateShowtimeDto.theater;
    showtimeToUpdate.startTime = updateShowtimeDto.startTime;
    showtimeToUpdate.endTime = updateShowtimeDto.endTime;
    showtimeToUpdate.movieId = updateShowtimeDto.movieId;
    await this.showtimeRepository.save(showtimeToUpdate);
  }

  /**
   * Deletes a showtime by its ID.
   *
   * @param {number} showtimeId - The ID of the showtime to delete.
   * @return {Promise<void>} Resolves when the showtime has been successfully deleted.
   */
  async delete(showtimeId: number): Promise<void> {
    const showtime = await this.findById(showtimeId);
    await this.showtimeRepository.remove(showtime);
  }

  /**
   * Checks if a theater is free during a specified time interval. Optionally excludes a specific showtime ID from the check.
   *
   * @param {string} theater - The name or identifier of the theater to check availability for.
   * @param {Date} startTime - The start time of the interval to check.
   * @param {Date} endTime - The end time of the interval to check.
   * @param {number} [excludeId] - Optional ID of a showtime to exclude from the availability check.
   * @return {Promise<Boolean>} - A promise resolving to true if the theater is free during the specified interval, otherwise false.
   */
  private async isTheatreFree(
    theater: string,
    startTime: Date,
    endTime: Date,
    excludeId?: number,
  ): Promise<boolean> {
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
