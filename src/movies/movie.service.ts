import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';


@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(newMovie);
  }

  // async createMovie(movie: Movie): Promise<Movie> {
  //   const newMovie = this.movieRepository.create(movie);
  //   return this.movieRepository.save(newMovie);
  // }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find(); // fetch all movies
  }


  // findMovie(title: string): Promise<Movie | null> {
  //   return this.movieRepository.findOneBy({ title });
  // }
  //
  // updateMovie(title: string, updateMovieDto: UpdateMovieDto): Promise<void> {
  //   const movieToUpdate = this.movieRepository.find((movie) => movie.title === title);
  //   if (!movieToUpdate) {
  //     throw new Error('Movie not found'); // todo - change?
  //   }
  //
  //   movieToUpdate.title = updateMovieDto.title;
  //   movieToUpdate.genre = updateMovieDto.genre;
  //   movieToUpdate.duration = updateMovieDto.duration;
  //   movieToUpdate.releaseYear = updateMovieDto.releaseYear;
  //
  //
  // }

  async remove(title: string): Promise<void> {
    await this.movieRepository.delete(title);
  }

}
