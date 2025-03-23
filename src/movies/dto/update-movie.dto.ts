import { IsInt, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

//todo - add error messages?
//for example - @MinLength(2, { message: 'Name must have atleast 2 characters.' })

export class UpdateMovieDto {
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(1, 255)
  genre: string;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsInt()
  @IsNotEmpty()
  releaseYear: number;
}

