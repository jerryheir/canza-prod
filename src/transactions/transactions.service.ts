import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './transactions.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  async createTransactions(object: any) {
    return await this.transactionsRepository.save(object);
  }

  async getMyTransactions(object: any) {
    return await this.transactionsRepository.find(object);
  }
}
