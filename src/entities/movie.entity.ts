import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from './showtime.entity';

// import { Showtime } from './showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column({ type: 'float' })
  rating: number;

  @Column()
  releaseYear: number;

  // A movie can have several showtimes, but each showtime belongs to only one movie
  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
