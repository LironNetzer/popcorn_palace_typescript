import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { Booking } from './booking.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @Column()
  theater: string;

  @Column('timestamptz')
  startTime: Date;

  @Column('timestamptz')
  endTime: Date;

  @Column()
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' }) // A foreign key
  movie: Movie;

  @OneToMany(() => Booking, booking => booking.showtime)
  bookings: Booking[];

  //todo - add booking
}
