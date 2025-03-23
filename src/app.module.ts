import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movies/movie.entity';
import { MovieModule } from './movies/movie.module';

// The root module of the application.

@Module({
  imports: [
    TypeOrmModule.forRoot({ // to enable TypeORM services globally in the code
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      autoLoadEntities: true,
      entities: [Movie],
      synchronize: true, //todo - change
    }),
    MovieModule,
  ],
  // controllers: [MovieController],
  // providers: [MovieService],
})
export class AppModule {
}
