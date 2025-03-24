import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Showtime } from '../entities/showtime.entity';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtime.dto';


/**
 * Controller for managing showtimes.
 * Handles HTTP requests related to showtime operations such as
 * retrieving, creating, updating, and deleting showtimes.
 */
@Controller('showtimes')
export class ShowtimeController {
  /**
   * Constructs an instance of the class and initializes it with the provided service.
   *
   * @param {ShowtimeService} showtimeService - The service instance used to manage or retrieve showtime-related data.
   */
  constructor(private readonly showtimeService: ShowtimeService) {
  }

  /**
   * Retrieves a showtime by its unique identifier.
   *
   * @param {number} showtimeId - The unique identifier of the showtime.
   * @return {Promise<Showtime>} A promise that resolves to the showtime object.
   */
  @Get(':showtimeId')
  findById(@Param('showtimeId', ParseIntPipe) showtimeId: number): Promise<Showtime> {
    return this.showtimeService.findById(showtimeId);
  }

  /**
   * Creates a new showtime based on the provided data.
   *
   * @param {CreateShowtimeDto} createShowtimeDto - The DTO containing showtime details to be created.
   * @return {Promise<Showtime>} A promise resolving to the created showtime.
   */
  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async createShowtime(@Body() createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimeService.create(createShowtimeDto);
  }

  /**
   * Updates the details of an existing showtime.
   *
   * @param {number} showtimeId - The ID of the showtime to be updated.
   * @param {UpdateShowtimeDto} updateShowtimeDto - The data used to update the showtime.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   */
  @Post('update/:showtimeId')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async updateShowtime(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<void> {
    return this.showtimeService.update(showtimeId, updateShowtimeDto);
  }

  /**
   * Deletes a showtime identified by its ID.
   *
   * @param {number} showtimeId - The ID of the showtime to delete.
   * @return {Promise<void>} A promise that resolves when the showtime is successfully deleted.
   */
  @Delete(':showtimeId')
  async deleteShowtime(@Param('showtimeId', ParseIntPipe) showtimeId: number): Promise<void> {
    await this.showtimeService.delete(showtimeId);
  }
}
