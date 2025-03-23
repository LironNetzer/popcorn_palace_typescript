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

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find(); // fetch all movies
  }

  async findMovie(id: number): Promise<Movie | null> {
    return this.movieRepository.findOneBy({ id });
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(newMovie);
  }

  //todo - add delete
}
