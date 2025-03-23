import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' }) //add length?
  title: string;

  @Column({ type: 'varchar' })
  genre: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'int' })
  releaseYear: number;
}
