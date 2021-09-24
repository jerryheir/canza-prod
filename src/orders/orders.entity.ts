import { Currency } from '../interfaces';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  // @Column()
  // post_type: number;
  @Column()
  buy_type: 1 | 2; // 1 for buy and 2 for sell
  @Column()
  supported_coin_id: number;
  @Column()
  amount: number;
  @Column()
  request_amount: number;
  @Column({ default: 'created' })
  resolved_status: 'created' | 'pending' | 'completed';
  @Column({ default: null })
  resolved_by: number;
  @Column()
  location_id: number;
  @Column({ default: null })
  amount_resolved_at: number;
  @Column({ default: null })
  currency_resolved_at: Currency;
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
