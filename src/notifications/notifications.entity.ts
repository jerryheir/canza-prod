import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  type: 'order' | 'issue' | 'swap';
  @Column()
  description: string;
  @Column({ default: null })
  metadata: any;
}
