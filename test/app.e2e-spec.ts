import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { CreateMovieDto } from '../src/movies/movie.dto';
import { CreateShowtimeDto } from '../src/showtimes/showtime.dto';
import { CreateBookingDto } from '../src/booking/booking.dto';

describe('Popcorn Palace E2E Tests', () => {
  let app: INestApplication;
  let createdMovieId: number;
  let createdShowtimeId: number;
  let createdBookingId: string;

  // Test data
  const testMovie: CreateMovieDto = {
    title: 'Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2023,
  };

  const testShowtime: CreateShowtimeDto = {
    movieId: 0, // will be set after movie creation
    theater: 'Test Theater 1',
    price: 12.50,
    startTime: new Date('2024-03-25T18:00:00Z'),
    endTime: new Date('2024-03-25T20:00:00Z'),
  };

  const testBooking: CreateBookingDto = {
    showtimeId: 0, // will be set after showtime creation
    seatNumber: 5,
    userId: 'test-user-1',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'popcorn-palace',
          password: 'popcorn-palace',
          database: 'popcorn-palace',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Movie Module E2E Tests
  describe('Movie Module', () => {
    it('should create a new movie', async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(testMovie)
        .expect(200);

      expect(response.body.title).toEqual(testMovie.title);
      expect(response.body.genre).toEqual(testMovie.genre);
      createdMovieId = response.body.id;
    });

    it('should prevent creating a duplicate movie', async () => {
      await request(app.getHttpServer())
        .post('/movies')
        .send(testMovie)
        .expect(400);
    });

    it('should fetch all movies', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies/all')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update an existing movie', async () => {
      const updateData = {
        ...testMovie,
        title: 'Updated Test Movie',
        rating: 9.0,
      };

      await request(app.getHttpServer())
        .post(`/movies/update/${testMovie.title}`)
        .send(updateData)
        .expect(200);
    });
  });

  // Showtime Module E2E Tests
  describe('Showtime Module', () => {
    it('should create a new showtime', async () => {
      // Set the movieId to the created movie's ID
      testShowtime.movieId = createdMovieId;

      const response = await request(app.getHttpServer())
        .post('/showtimes')
        .send(testShowtime)
        .expect(200);

      expect(response.body.theater).toEqual(testShowtime.theater);
      createdShowtimeId = response.body.id;
    });

    it('should prevent creating overlapping showtimes', async () => {
      // Try to create a showtime with overlapping time
      const overlappingShowtime = {
        ...testShowtime,
        theater: 'Test Theater 1',
        startTime: new Date('2024-03-25T19:00:00Z'),
        endTime: new Date('2024-03-25T21:00:00Z'),
      };

      await request(app.getHttpServer())
        .post('/showtimes')
        .send(overlappingShowtime)
        .expect(400);
    });

    it('should fetch a specific showtime', async () => {
      const response = await request(app.getHttpServer())
        .get(`/showtimes/${createdShowtimeId}`)
        .expect(200);

      expect(response.body.id).toEqual(createdShowtimeId);
    });
  });

  // Booking Module E2E Tests
  describe('Booking Module', () => {
    it('should create a new booking', async () => {
      // Set the showtimeId to the created showtime's ID
      testBooking.showtimeId = createdShowtimeId;

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send(testBooking)
        .expect(200);

      expect(response.body).toHaveProperty('bookingId');
      createdBookingId = response.body.bookingId;
    });

    it('should prevent booking the same seat twice', async () => {
      await request(app.getHttpServer())
        .post('/bookings')
        .send(testBooking)
        .expect(400);
    });
  });

  // Cleanup and Delete Tests
  describe('Cleanup', () => {
    it('should delete a booking', async () => {
      // Note: The current code doesn't have a delete endpoint for bookings
      // This test is a placeholder for future implementation
      // await request(app.getHttpServer())
      //   .delete(`/bookings/${createdBookingId}`)
      //   .expect(200);
    });

    it('should delete a showtime', async () => {
      await request(app.getHttpServer())
        .delete(`/showtimes/${createdShowtimeId}`)
        .expect(200);
    });

    it('should delete a movie', async () => {
      await request(app.getHttpServer())
        .delete(`/movies/Updated Test Movie`)
        .expect(200);
    });
  });
});