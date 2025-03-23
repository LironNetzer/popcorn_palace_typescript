import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

//todo - add error messages?
//for example - @MinLength(2, { message: 'Name must have atleast 2 characters.' })

export class CreateMovieDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 100)
  genre: string;

  @IsInt()
  @Min(1)
  @Max(873) // longest movie ever is 873 minutes
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @Min(1800)
  @Max(2200)
  releaseYear: number;
}

export class UpdateMovieDto extends CreateMovieDto {
}


