import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { responseData } from '../interfaces';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders.dto';
import { UsersService } from '../users/users.service';
import { CoinsService } from '../coins/coins.service';
import { Currencies } from '../coins/currencies';
export declare class OrdersController {
    private readonly usersService;
    private readonly ordersService;
    private readonly coinsService;
    private readonly notificationsService;
    private readonly currencies;
    constructor(usersService: UsersService, ordersService: OrdersService, coinsService: CoinsService, notificationsService: NotificationsService, currencies: Currencies);
    getMyOrders(request: Request): Promise<responseData>;
    getAllOrders(request: Request): Promise<responseData>;
    updateMyOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<BadRequestException | {
        status: string;
        message: string;
    }>;
    resolveOrder(request: Request, id: number): Promise<responseData>;
    deleteMyOrder(id: number): Promise<responseData>;
    createOrder(request: Request, createOrderDto: CreateOrderDto): Promise<BadRequestException | {
        status: string;
        message: string;
        data: any;
    }>;
    userInitiated(request: Request, id: number): Promise<BadRequestException | {
        status: string;
        message: string;
    }>;
    agentInitiated(id: number): Promise<BadRequestException | {
        status: string;
        message: string;
    }>;
}
