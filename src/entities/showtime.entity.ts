import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @Column()
  theater: string;
  // todo - add the constraint for theatre + start time + end time

  @Column('timestamptz')
  startTime: Date;

  @Column('timestamptz')
  endTime: Date;

  @Column()
  movieId: number;

  // @ManyToOne(() => Movie, movie => movie.showtimes)
  // @JoinColumn({ name: 'movieId' }) //foreign key
  // movie: Movie;
  // @OneToMany(() => Booking, booking => booking.showtime)
  // bookings: Booking[];

  //todo - add booking
}
