import { Currency } from '../interfaces';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  buy_type: 1 | 2; // 1 for buy and 2 for sell
  @Column()
  supported_coin_id: number;
  @Column()
  amount: number;
  @Column()
  request_amount: number;
  @Column({ default: 'created' })
  resolved_status: 'created' | 'pending' | 'initiated' | 'confirmed';
  @Column({ default: null })
  resolved_by: number;
  @Column({ default: 1 })
  location_id: number;
  @Column({ default: null })
  amount_resolved_at: number;
  @Column({ default: null })
  currency_resolved_at: Currency;
  @Column({ default: null })
  address?: string;
  @Column({ default: null })
  agent_address?: string;
  @Column({ default: null })
  tx_id: string;
  @Column({ default: null })
  bank_name: string;
  @Column({ default: null })
  account_number: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('swaptoken')
export class SwapToken {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  from: number; // supported_coin_id
  @Column()
  to: number; // supported_coin_id
  @Column()
  amount: number;
  @Column()
  fee: number;
  @Column()
  fee_currency: Currency;
}
