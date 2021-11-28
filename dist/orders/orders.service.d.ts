import { Repository } from 'typeorm';
import { Orders } from './orders.entity';
export declare class OrdersService {
    private readonly ordersRepository;
    constructor(ordersRepository: Repository<Orders>);
    getAllOrders(object?: any): Promise<Orders[]>;
    getAnOrder(object: any): Promise<Orders>;
    updateMyOrder(i: any, object: any): Promise<import("typeorm").UpdateResult>;
    deleteMyOrder(object: {
        id: number;
    }): Promise<boolean>;
    createOrder(object: any): Promise<any>;
}
