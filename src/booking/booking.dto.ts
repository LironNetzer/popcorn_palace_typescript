import { IsInt, IsString, Min } from 'class-validator';

/**
 * The CreateBookingDto class is a Data Transfer Object (DTO) used for creating a booking.
 * It defines the structure and validation rules for the data required to create a booking.
 */
export class CreateBookingDto {
  /**
   * Represents the unique identifier for a specific showtime.
   *
   * @type {number}
   */
  @IsInt()
  showtimeId: number;

  /**
   * Represents the number of a seat.
   *
   * Variable Type: number
   */
  @IsInt()
  @Min(1)
  seatNumber: number;

  /**
   * Represents the unique identifier for a user.
   */
  @IsString()
  userId: string;
}

/**
 * Represents the data transfer object for a booking response.
 */
export class BookingResponseDto {
  bookingId: string; //todo - make sure its uuid
}