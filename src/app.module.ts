import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie} from './movie.entity';

// The root module of the application.

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      autoLoadEntities: true,
      entities: [Movie],
      synchronize: true, //todo - change
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
