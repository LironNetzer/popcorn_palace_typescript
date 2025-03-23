import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // @ManyToOne(() => Showtime, showtime => showtime.bookings)
  // @JoinColumn({ name: 'showtimeId' })
  // showtime: Showtime;
}