import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieService } from './movie.service';
import { Movie } from '../entities/movie.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('MovieService', () => {
  let service: MovieService;
  let repo: Repository<Movie>;

  const mockMovieRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));

    // Reset mock calls between tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const mockMovies = [
        {
          id: 1,
          title: 'Test Movie',
          genre: 'Action',
          duration: 120,
          rating: 8.5,
          releaseYear: 2023,
        },
        {
          id: 2,
          title: 'Another Movie',
          genre: 'Comedy',
          duration: 90,
          rating: 7.0,
          releaseYear: 2024,
        },
      ];
      mockMovieRepository.find.mockResolvedValue(mockMovies);

      const result = await service.findAll();
      expect(result).toEqual(mockMovies);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no movies exist', async () => {
      mockMovieRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      };
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findById(1);
      expect(result).toEqual(mockMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if movie does not exist ', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);
      expect(result).toBeNull();
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('findByTitle', () => {
    it('should return a movie by title', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      };
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findByTitle('Test Movie');
      expect(result).toEqual(mockMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Test Movie' },
      });
    });

    it('should throw NotFoundException when movie title not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.findByTitle('Nonexistent Movie')).rejects.toThrow(NotFoundException);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Nonexistent Movie' },
      });
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto = {
        title: 'New Movie',
        genre: 'Comedy',
        duration: 90,
        rating: 7.5,
        releaseYear: 2025,
      };

      const newMovie = { id: 1, ...createMovieDto };

      mockMovieRepository.findOne.mockResolvedValue(null);
      mockMovieRepository.create.mockReturnValue(newMovie);
      mockMovieRepository.save.mockResolvedValue(newMovie);

      const result = await service.create(createMovieDto);

      expect(result).toEqual(newMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: createMovieDto.title },
      });
      expect(mockMovieRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(newMovie);
    });

    it('should throw BadRequestException when movie with same title exists', async () => {
      const createMovieDto = {
        title: 'Existing Movie',
        genre: 'Drama',
        duration: 120,
        rating: 9.0,
        releaseYear: 2024,
      };

      mockMovieRepository.findOne.mockResolvedValue({ id: 1, ...createMovieDto });

      await expect(service.create(createMovieDto)).rejects.toThrow(BadRequestException);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: createMovieDto.title },
      });
      expect(mockMovieRepository.create).not.toHaveBeenCalled();
      expect(mockMovieRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const existingMovie = {
        id: 1,
        title: 'Original Title',
        genre: 'Drama',
        duration: 120,
        rating: 8.0,
        releaseYear: 2023,
      };

      const updateMovieDto = {
        title: 'Updated Title',
        genre: 'Action',
        duration: 130,
        rating: 8.5,
        releaseYear: 2023,
      };

      const updatedMovie = { ...existingMovie, ...updateMovieDto };

      mockMovieRepository.findOne.mockResolvedValue(existingMovie);
      mockMovieRepository.save.mockResolvedValue(updatedMovie);

      await service.update('Original Title', updateMovieDto);
      const result = await service.findById(1);

      expect(result).toEqual(updatedMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Original Title' },
      });
      expect(mockMovieRepository.save).toHaveBeenCalledWith(updatedMovie);
    });

    it('should throw NotFoundException when trying to update non-existent movie', async () => {
      const updateMovieDto = {
        title: 'Updated Title',
        genre: 'Action',
        duration: 130,
        rating: 8.5,
        releaseYear: 2023,
      };

      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.update('Nonexistent Movie', updateMovieDto)).rejects.toThrow(NotFoundException);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Nonexistent Movie' },
      });
      expect(mockMovieRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an existing movie', async () => {
      const existingMovie = {
        id: 1,
        title: 'Movie to Remove',
        genre: 'Horror',
        duration: 95,
        rating: 7.2,
        releaseYear: 2022,
      };

      mockMovieRepository.findOne.mockResolvedValue(existingMovie);
      mockMovieRepository.remove.mockResolvedValue(existingMovie);

      await service.remove('Movie to Remove');

      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Movie to Remove' },
      });
      expect(mockMovieRepository.remove).toHaveBeenCalledWith(existingMovie);
    });

    it('should throw NotFoundException when trying to remove non-existent movie', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('Nonexistent Movie')).rejects.toThrow(NotFoundException);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Nonexistent Movie' },
      });
      expect(mockMovieRepository.remove).not.toHaveBeenCalled();
    });
  });
});

