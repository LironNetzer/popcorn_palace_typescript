import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column()
  showtimeId: number;

  @Column()
  seatNumber: number;

  @Column()
  userId: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtimeId' }) // A foreign key
  showtime: Showtime;
}