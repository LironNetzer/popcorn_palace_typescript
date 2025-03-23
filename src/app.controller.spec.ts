import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movies/movie.controller';
import { MovieService } from './movies/movie.service';

// The unit tests for the controller.

describe('AppController', () => {
  let appController: MovieController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [MovieService],
    }).compile();

    appController = app.get<MovieController>(MovieController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.findAll()).toBe('Hello World!');
    });
  });
});
