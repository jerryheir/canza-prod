import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('issue')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  email: string;
  @Column()
  description: string;
  @Column({ default: false })
  resolved: boolean;
}
