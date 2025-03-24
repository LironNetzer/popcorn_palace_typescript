import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Showtime } from './showtime.entity';

/**
 * Entity representing a booking for a showtime.
 */
@Entity()
export class Booking {
  /**
   * Unique identifier for the booking.
   */
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  /**
   * The number of seats booked.
   */
  @Column()
  showtimeId: number;

  /**
   * The ID of the associated showtime.
   */
  @Column()
  seatNumber: number;

  /**
   * The unique identifier for a user.
   */
  @Column()
  userId: string;

  /**
   * The showtime associated with this booking.
   */
  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtimeId' }) // A foreign key
  showtime: Showtime;
}
