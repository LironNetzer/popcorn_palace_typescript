import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

/**
 * Data transfer object for creating a movie.
 * Represents the required and validated properties for a new movie entry.
 */
export class CreateMovieDto {
  @IsString()
  @Length(1, 255)
  title: string;

  /**
   * Represents the genre or category of a particular item, such as a book, movie, music, or video game.
   * @type {string}
   */
  @IsString()
  @Length(1, 100)
  genre: string;

  /**
   * Represents the time duration of the movie.
   * @type {number}
   */
  @IsInt()
  @Min(1)
  @Max(873) // longest movie ever is 873 minutes
  duration: number;

  /**
   * Represents the movie's rating.
   **/
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  /**
   * The release year of the movie.
   * */
  @IsInt()
  @Min(1800)
  @Max(2200)
  releaseYear: number;
}

/**
 * Represents a Data Transfer Object (DTO) for updating an existing movie entity.
 * This class is an extension of the CreateMovieDto.
 */
export class UpdateMovieDto extends CreateMovieDto {}
