import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  state: string;
  @Column()
  country: string;
}
