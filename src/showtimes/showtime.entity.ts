import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movie: string;

  @Column()
  theater: string;
  // todo - add the constraint for theatre + start time + end time

  @Column()
  startTime: number;

  @Column()
  endTime: number;

  @Column()
  price: number;
}
