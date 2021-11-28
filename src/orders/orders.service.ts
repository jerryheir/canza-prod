import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getAllOrders(object?: any) {
    return await this.ordersRepository.find(object);
  }

  async getAnOrder(object: any) {
    return await this.ordersRepository.findOne(object);
  }

  async updateMyOrder(i: any, object: any) {
    const result = await this.ordersRepository.update(i, object);
    return result;
  }

  async deleteMyOrder(object: { id: number }) {
    await this.ordersRepository.delete(object);
    return true;
  }

  async createOrder(object: any) {
    const result = await this.ordersRepository.save(object);
    return result;
  }
}
