import { Supported } from '../interfaces';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('coins')
export class Coins {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: '0.00000000' })
  amount: string;
  @Column()
  userId: number;
  @Column()
  supported_coin_id: number;
  @Column()
  private_key: string;
  @Column()
  address: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('supported_coins')
export class SupportedCoins {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: Supported;
  @Column()
  image_url: string;
  @Column()
  coin_name: string;
}

// bch https://www.bitcoin.com/images/uploads/homepage-ticker-bch.png bitcoin-cash

// eth https://markets.bitcoin.com/images/coins/1027.png // ethereum

// xrp https://markets.bitcoin.com/images/coins/52.png // ripple

// ltc https://markets.bitcoin.com/images/coins/2.png litecoin
