import {
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Data transfer object for creating a showtime.
 */
export class CreateShowtimeDto {
  /**
   * Represents the price value of a show.
   *
   * @type {number}
   */
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Represents the unique identifier of a movie.
   *
   * @type {number}
   */
  @IsInt()
  @Min(1)
  movieId: number;

  /**
   * Represents the name of the theater.
   *
   * @type {string}
   */
  @IsString()
  @Length(1, 255)
  theater: string;

  /**
   * The start time of the show
   */
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  /**
   * The end time of the show.
   */
  @IsDate()
  @Type(() => Date)
  endTime: Date;
}

/**
 * Represents the data transfer object for updating a showtime.
 * This class extends from the CreateShowtimeDto.
 */
export class UpdateShowtimeDto extends CreateShowtimeDto {}
