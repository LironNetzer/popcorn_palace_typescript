import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from './booking.service';
import { ShowtimeService } from '../showtimes/showtime.service';
import { Booking } from '../entities/booking.entity';
import { BadRequestException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;

  const mockBookingRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockShowtimeService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: ShowtimeService,
          useValue: mockShowtimeService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    repo = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    showtimeService = module.get<ShowtimeService>(ShowtimeService);

    // Reset mock calls between tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new booking for available seat', async () => {
      const createBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      const mockShowtime = {
        id: 1,
        movieId: 1,
        price: 12.5,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T18:00:00Z'),
        endTime: new Date('2025-04-01T20:30:00Z'),
      };

      const newBooking = {
        bookingId: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
        ...createBookingDto,
      };

      // Mock showtime existence check
      mockShowtimeService.findById.mockResolvedValue(mockShowtime);

      // Mock seat availability check
      mockBookingRepository.findOne.mockResolvedValue(null);

      mockBookingRepository.create.mockReturnValue(newBooking);
      mockBookingRepository.save.mockResolvedValue(newBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual(newBooking);
      expect(mockShowtimeService.findById).toHaveBeenCalledWith(
        createBookingDto.showtimeId,
      );
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
        where: {
          showtimeId: createBookingDto.showtimeId,
          seatNumber: createBookingDto.seatNumber,
        },
      });
      expect(mockBookingRepository.create).toHaveBeenCalledWith(
        createBookingDto,
      );
      expect(mockBookingRepository.save).toHaveBeenCalledWith(newBooking);
    });

    it('should throw BadRequestException when seat is already booked', async () => {
      const createBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      const mockShowtime = {
        id: 1,
        movieId: 1,
        price: 12.5,
        theater: 'Theater 1',
        startTime: new Date('2025-04-01T18:00:00Z'),
        endTime: new Date('2025-04-01T20:30:00Z'),
      };

      const existingBooking = {
        bookingId: 'existing-id',
        showtimeId: 1,
        seatNumber: 15,
        userId: 'another-user-id',
      };

      // Mock showtime existence check
      mockShowtimeService.findById.mockResolvedValue(mockShowtime);

      // Mock seat availability check - seat already booked
      mockBookingRepository.findOne.mockResolvedValue(existingBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockShowtimeService.findById).toHaveBeenCalledWith(
        createBookingDto.showtimeId,
      );
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
        where: {
          showtimeId: createBookingDto.showtimeId,
          seatNumber: createBookingDto.seatNumber,
        },
      });
      expect(mockBookingRepository.create).not.toHaveBeenCalled();
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
    });
  });
});
