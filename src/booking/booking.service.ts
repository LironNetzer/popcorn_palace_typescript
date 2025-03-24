import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';


@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {
  }

  // findAll(): Promise<Movie[]> {
  //   return this.movieRepository.find(); // fetch all movies
  // }
  //
  // findById(movieId: number): Promise<Movie> {
  //   return this.movieRepository.findOne({ where: { id: movieId } });
  // }
  //
  // async create(createMovieDto: CreateMovieDto): Promise<Movie> {
  //   // check if there is already a movie with this name (in general a title
  //   // isn't unique for a movie, but because the update function is by a movie
  //   // title, it won't be consistent to allow two entities with the same name
  //   const existingMovie: Movie = await this.movieRepository.findOne({ where: { title: createMovieDto.title } });
  //   if (existingMovie) {
  //     throw new HttpException(`Movie with the title ${createMovieDto.title} already exists.`, HttpStatus.BAD_REQUEST);
  //   }
  //
  //   const newMovie = this.movieRepository.create(createMovieDto);
  //   return this.movieRepository.save(newMovie);
  // }
  //
  // async findByTitle(title: string): Promise<Movie> {
  //   const movie = await this.movieRepository.findOne({ where: { title: title } });
  //   if (!movie) {
  //     throw new Error(`Movie with the title ${title} doesnt exist`); //todo - change
  //   }
  //   return movie;
  // }
  //
  // async update(movieTitle: string, updateMovieDto: UpdateMovieDto): Promise<void> {
  //   const movieToUpdate = await this.movieRepository.findOne({ where: { title: movieTitle } });
  //   if (!movieToUpdate) {
  //     throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   movieToUpdate.title = updateMovieDto.title;
  //   movieToUpdate.genre = updateMovieDto.genre;
  //   movieToUpdate.duration = updateMovieDto.duration;
  //   movieToUpdate.releaseYear = updateMovieDto.releaseYear;
  //
  //   await this.movieRepository.save(movieToUpdate);
  // }
  //
  // async delete(title: string): Promise<void> {
  //   const movie = await this.findByTitle(title);
  //   await this.movieRepository.remove(movie);
  //   // todo - change to delete? (faster, but can't add the condition to make sure it exists
  // }

}
