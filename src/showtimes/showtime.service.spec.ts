import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimeService } from './showtime.service';
import { Showtime } from '../entities/showtime.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MovieService } from '../movies/movie.service';

describe('ShowtimeService', () => {
  let service: ShowtimeService;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockShowtimeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockMovieService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    service = module.get<ShowtimeService>(ShowtimeService);
    repo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    movieService = module.get<MovieService>(MovieService);

    // Reset mock calls between tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a showtime by id', async () => {
      const mockShowtime = {
        id: 1,
        price: 50.2,
        movieId: 1,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };
      mockShowtimeRepository.findOne.mockResolvedValue(mockShowtime);

      const result = await service.findById(1);
      expect(result).toEqual(mockShowtime);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw not found exception if showtime does not exist ', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      // const result = await service.findById(999);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('create', () => {
    it('should create a new showtime when no overlaps exist', async () => {
      const createShowtimeDto = {
        movieId: 1,
        price: 1.2,
        theater: 'Theater 1',
        startTime: new Date('2025-02-14T11:47:46.125405Z'),
        endTime: new Date('2025-02-14T14:47:46.125405Z'),
      };

      const newShowtime = { id: 1, ...createShowtimeDto };

      // mock movie existence check
      mockMovieService.findById.mockResolvedValue({
        id: 1,
        title: 'Test Movie',
      });

      // mock overlap check
      mockQueryBuilder.getMany.mockResolvedValue([]);

      mockShowtimeRepository.create.mockReturnValue(newShowtime);
      mockShowtimeRepository.save.mockResolvedValue(newShowtime);
      const result = await service.create(createShowtimeDto);

      expect(result).toEqual(newShowtime);
      expect(mockMovieService.findById).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(mockShowtimeRepository.createQueryBuilder).toHaveBeenCalledWith(
        'showtime',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'showtime.theater = :theater',
        { theater: 'Theater 1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(showtime.startTime < :endTime AND showtime.endTime > :startTime)',
        {
          startTime: createShowtimeDto.startTime,
          endTime: createShowtimeDto.endTime,
        },
      );
      expect(mockShowtimeRepository.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
      expect(mockShowtimeRepository.save).toHaveBeenCalledWith(newShowtime);
    });

    it('should throw BadRequestException when showtimes overlap', async () => {
      const createShowtimeDto = {
        movieId: 1,
        price: 12.5,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T18:00:00Z'),
        endTime: new Date('2025-04-01T20:30:00Z'),
      };

      // Mock movie existence check
      mockMovieService.findById.mockResolvedValue({
        id: 1,
        title: 'Test Movie',
      });

      // Mock overlap check - return existing overlapping showtime
      mockQueryBuilder.getMany.mockResolvedValue([
        {
          id: 2,
          movieId: 2,
          theater: 'Theater 1',
          startTime: new Date('2025-04-01T19:00:00Z'),
          endTime: new Date('2025-04-01T21:00:00Z'),
        },
      ]);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMovieService.findById).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(mockShowtimeRepository.createQueryBuilder).toHaveBeenCalledWith(
        'showtime',
      );
      expect(mockShowtimeRepository.create).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when start time is after end time', async () => {
      const createShowtimeDto = {
        movieId: 1,
        price: 12.5,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T20:30:00Z'), // Start time is after end time
        endTime: new Date('2025-04-01T18:00:00Z'),
      };

      // Mock movie existence check
      mockMovieService.findById.mockResolvedValue({
        id: 1,
        title: 'Test Movie',
      });

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMovieService.findById).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(mockShowtimeRepository.create).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      const createShowtimeDto = {
        movieId: 999, // Non-existent movie ID
        price: 12.5,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T18:00:00Z'),
        endTime: new Date('2025-04-01T20:30:00Z'),
      };

      // Mock movie existence check to throw error
      mockMovieService.findById.mockRejectedValue(
        new NotFoundException('Movie not found'),
      );

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockMovieService.findById).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(mockShowtimeRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.create).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing showtime when no overlaps exist', async () => {
      const existingShowtime = {
        id: 1,
        movieId: 1,
        price: 10.0,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T18:00:00Z'),
        endTime: new Date('2025-04-01T20:00:00Z'),
      };

      const updateShowtimeDto = {
        movieId: 2,
        price: 12.5,
        theater: 'Theater 2',
        startTime: new Date('2025-04-01T19:00:00Z'),
        endTime: new Date('2025-04-01T21:30:00Z'),
      };

      const updatedShowtime = { ...existingShowtime, ...updateShowtimeDto };

      // Mock showtime existence check
      mockShowtimeRepository.findOne.mockResolvedValue(existingShowtime);

      // Mock movie existence check
      mockMovieService.findById.mockResolvedValue({
        id: 2,
        title: 'Another Movie',
      });

      // Mock overlap check
      mockQueryBuilder.getMany.mockResolvedValue([]);

      mockShowtimeRepository.save.mockResolvedValue(updatedShowtime);

      await service.update(1, updateShowtimeDto);
      const result = await service.findById(1);

      expect(result).toEqual(updatedShowtime);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockShowtimeRepository.createQueryBuilder).toHaveBeenCalledWith(
        'showtime',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'showtime.theater = :theater',
        { theater: 'Theater 2' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(showtime.startTime < :endTime AND showtime.endTime > :startTime)',
        {
          startTime: updateShowtimeDto.startTime,
          endTime: updateShowtimeDto.endTime,
        },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'showtime.id != :excludeId',
        { excludeId: 1 },
      );
      expect(mockShowtimeRepository.save).toHaveBeenCalledWith(updatedShowtime);
    });
  });

  describe('delete', () => {
    it('should delete an existing showtime', async () => {
      const existingShowtime = {
        id: 1,
        movieId: 1,
        price: 10.0,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T18:00:00Z'),
        endTime: new Date('2025-04-01T20:00:00Z'),
      };

      mockShowtimeRepository.findOne.mockResolvedValue(existingShowtime);
      mockShowtimeRepository.remove.mockResolvedValue(existingShowtime);

      await service.delete(1);

      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockShowtimeRepository.remove).toHaveBeenCalledWith(
        existingShowtime,
      );
    });
  });
});
