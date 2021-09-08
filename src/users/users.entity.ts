import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column()
  image_url: string;
  @Column()
  role: string;
  @Column()
  google_signin: 0 | 1;
}
