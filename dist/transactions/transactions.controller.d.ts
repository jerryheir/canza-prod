import { TransactionsService } from './transactions.service';
import { responseData } from '../interfaces';
import { Request } from 'express';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getIssue(request: Request): Promise<responseData>;
}
