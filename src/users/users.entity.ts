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
  image_url?: string;
  @Column({ default: 1 }) // 1 for user, 2 for admin, 3 for maybe super admin
  role: number;
  @Column({ default: 0 })
  google_signin: 0 | 1;
  @Column({ default: 0 })
  verified: 0 | 1;
  @Column({ default: 0 })
  banned: 0 | 1;
  @Column({ default: 0 })
  location: number;
  @Column({ default: null })
  phone: string;
}
