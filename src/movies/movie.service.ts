import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto } from './movie.dto';


@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {
  }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find(); // fetch all movies
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    // check if there is already a movie with this name (in general a title
    // isn't unique for a movie, but because the update function is by a movie
    // title, it won't be consistent to allow tow entities with the same name
    const existingMovie: Movie = await this.movieRepository.findOne({ where: { title: createMovieDto.title } });
    if (existingMovie) {
      throw new Error('Movie with the title ${createMovieDto.title} already exists'); //todo - fix string interpolation
    }

    const newMovie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(newMovie);
  }

  async findByTitle(title: string): Promise<Movie | null> {
    const movie = await this.movieRepository.findOne({ where: { title: title } });
    if (!movie) {
      throw new Error('Movie with the title ${title} doesnt exist');
    }
    return movie;
  }

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
    const movie = await this.findByTitle(title);
    await this.movieRepository.remove(movie);
    // todo - change to delete? (faster, but can't add the condition to make sure it exists
  }

}
