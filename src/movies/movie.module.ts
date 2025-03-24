import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from '../entities/movie.entity';

/**
 * The MovieModule is responsible for managing the movie-related features of
 * the application. It connects the Movie entity to the database, provides
 * services for handling the different logics, and includes controllers
 * for routing incoming requests related to movies.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
