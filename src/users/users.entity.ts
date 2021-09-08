import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: null })
  image_url: string;
  @Column()
  role: string;
  @Column()
  google_signin: 0 | 1;
}
