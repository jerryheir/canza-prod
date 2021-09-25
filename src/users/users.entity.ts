import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @Column({ default: 1 }) // 1 for user, 2 for agents, 3 for maybe admin
  role: number;
  @Column({ default: 0 })
  google_signin: 0 | 1;
  @Column({ default: 0 })
  verified: 0 | 1;
  @Column({ default: 0 })
  banned: 0 | 1;
  @Column({ default: 1 })
  location: number;
  @Column({ default: null })
  phone: string;
  @Column({ default: 0 })
  wallet_balance: number;
  @Column({ default: null })
  fcm_token: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('contacts')
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  contact_id: number;
}
