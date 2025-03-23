import { IsDate, IsInt, IsNumber, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateShowtimeDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  movieId: number;

  @IsString()
  @Length(1, 255)
  theater: string;

  @IsDate()
  @Type(() => Date) //todo ?
  startTime: Date;

  @IsDate()
  @Type(() => Date) //todo ?
  endTime: Date;
}

export class UpdateShowtimeDto extends CreateShowtimeDto {
}


