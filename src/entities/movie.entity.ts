import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from './showtime.entity';

/**
 * Represents a movie entity in a database.
 */
@Entity()
export class Movie {
  /**
   * A unique identifier for the movie.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The title of the movie.
   */
  @Column()
  title: string;

  /**
   * The genre of the movie.
   */
  @Column()
  genre: string;

  /**
   * The duration of the movie in minutes.
   */
  @Column()
  duration: number;

  /**
   * The rating of the movie.
   */
  @Column({ type: 'decimal' })
  rating: number;

  /**
   * The release year of the movie.
   */
  @Column()
  releaseYear: number;

  /**
   * List of showtimes associated with this movie.
   */
  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
