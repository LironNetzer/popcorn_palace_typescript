import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // @OneToMany(() => Showtime, showtime => showtime.movie)
  // showtimes: Showtime[];

  // add relation - one to many with showtime
}
