import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Booking } from './booking.entity';

/**
 * Entity representing a showtime for a movie.
 */
@Entity()
export class Showtime {
  /**
   * Unique identifier for the showtime.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The price of the showtime.
   */
  @Column({ type: 'float' })
  price: number;

  /**
   * The name of a theatre
   */
  @Column()
  theater: string;

  /**
   * Represents the starting time of an event or process.
   * This variable stores the date and time at which an operation begins.
   * It is expected to be a valid JavaScript Date object.
   */
  @Column('timestamptz')
  startTime: Date;

  /**
   * Represents the end time of a specific event or process.
   * This variable is expected to be a Date object representing the precise time
   * when the event or process concludes.
   */
  @Column('timestamptz')
  endTime: Date;

  /**
   * A unique identifier representing a specific movie.
   */
  @Column()
  movieId: number;

  /**
   * The movie associated with this showtime.
   */
  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' }) // A foreign key
  movie: Movie;

  /**
   * List of bookings for this showtime.
   */
  @OneToMany(() => Booking, (booking) => booking.showtime)
  bookings: Booking[];
}
