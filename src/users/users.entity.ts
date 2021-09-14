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
  @Column({ default: 0 })
  google_signin: 0 | 1;
  @Column({ default: 0 })
  verified: 0 | 1;
}
