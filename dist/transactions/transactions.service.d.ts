import { Repository } from 'typeorm';
import { Transactions } from './transactions.entity';
export declare class TransactionsService {
    private readonly transactionsRepository;
    constructor(transactionsRepository: Repository<Transactions>);
    createTransactions(object: any): Promise<any>;
    getMyTransactions(object: any): Promise<Transactions[]>;
}
