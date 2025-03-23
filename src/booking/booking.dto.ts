import { IsInt, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  showtimeId: number;

  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsString()
  userId: string;
}
