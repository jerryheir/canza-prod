import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coins')
export class Coins {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: 0 })
  amount: number;
  @Column()
  userId: number;
  @Column()
  supported_coin_id: number;
}

@Entity('supported_coins')
export class SupportedCoins {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: 'btc' | 'eth' | 'cusd';
  @Column()
  image_url: string;
  @Column()
  coin_name: string;
}
