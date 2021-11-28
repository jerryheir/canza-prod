"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../notifications/notifications.service");
const helpers_1 = require("../helpers");
const roles_guard_1 = require("../roles.guard");
const orders_service_1 = require("./orders.service");
const orders_dto_1 = require("./dto/orders.dto");
const users_service_1 = require("../users/users.service");
const coins_service_1 = require("../coins/coins.service");
const currencies_1 = require("../coins/currencies");
let OrdersController = class OrdersController {
    constructor(usersService, ordersService, coinsService, notificationsService, currencies) {
        this.usersService = usersService;
        this.ordersService = ordersService;
        this.coinsService = coinsService;
        this.notificationsService = notificationsService;
        this.currencies = currencies;
    }
    async getMyOrders(request) {
        try {
            const user = request['guardUser'];
            const data = await this.ordersService.getAllOrders({ userId: user.id });
            return {
                status: 'success',
                message: 'Orders retrieved successfully',
                data: data,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async getAllOrders(request) {
        try {
            const user = request['guardUser'];
            if (user.role && user.role > 2) {
                const data = await this.ordersService.getAllOrders();
                return {
                    status: 'success',
                    message: 'Orders retrieved successfully',
                    data: data,
                };
            }
            else {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async updateMyOrder(id, updateOrderDto) {
        try {
            const order = await this.ordersService.getAnOrder({ id: id });
            if (order.buy_type === 1 && updateOrderDto.address) {
                return new common_1.BadRequestException('Bad Request');
            }
            if (order.buy_type === 2 &&
                (!updateOrderDto.agent_address ||
                    updateOrderDto.bank_name ||
                    updateOrderDto.account_number)) {
                return new common_1.BadRequestException('Bad Request');
            }
            const supported = await this.coinsService.getOneSupportedCoin({
                id: order.supported_coin_id,
            });
            const resolvingUser = await this.usersService.findOne({
                id: updateOrderDto.resolved_by,
            });
            await this.ordersService.updateMyOrder({
                id: id,
            }, Object.assign(Object.assign({}, updateOrderDto), { resolved_status: 'pending' }));
            await this.notificationsService.createNotifications({
                userId: order.userId,
                type: 'order',
                description: `Your order to ${order.buy_type === 1 ? 'buy' : 'sell'} ${order.amount} ${supported.type.toUpperCase()} has been accepted by ${resolvingUser.firstname} ${resolvingUser.lastname}.`,
                metadata: JSON.stringify(Object.assign(Object.assign({}, order), { resolved_status: 'pending' })),
            });
            return {
                status: 'success',
                message: 'Order updated successfully',
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async resolveOrder(request, id) {
        try {
            const user = request['guardUser'];
            const order = await this.ordersService.getAnOrder({
                id: id,
                resolved_by: user.id,
            });
            const coin = await this.coinsService.findOneCoin({
                userId: order.userId,
                supported_coin_id: order.supported_coin_id,
            });
            const supported = await this.coinsService.getOneSupportedCoin({
                id: order.supported_coin_id,
            });
            if (order) {
                if (coin) {
                    await this.coinsService.updateMyCoin(coin.id, {
                        amount: coin.amount + order.amount,
                        userId: order.userId,
                        supported_coin_id: order.supported_coin_id,
                    });
                }
                else {
                    await this.coinsService.addMyCoin({
                        amount: order.amount,
                        userId: order.userId,
                        supported_coin_id: order.supported_coin_id,
                    });
                }
                await this.ordersService.updateMyOrder({
                    id: id,
                }, {
                    resolved_status: 'completed',
                });
                await this.notificationsService.createNotifications({
                    userId: order.userId,
                    type: 'order',
                    description: `Your order to ${order.buy_type === 1 ? 'buy' : 'sell'} ${order.amount} ${supported.type.toUpperCase()} has been completed.`,
                    metadata: JSON.stringify(Object.assign(Object.assign({}, order), { resolved_status: 'completed' })),
                });
                return {
                    status: 'success',
                    message: 'Order resolved successfully',
                };
            }
            else {
                throw new common_1.BadRequestException();
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async deleteMyOrder(id) {
        try {
            const order = await this.ordersService.getAnOrder({ id: id });
            if (order && !order.resolved_by && order.resolved_status === 'created') {
                await this.ordersService.deleteMyOrder({ id: id });
                return {
                    status: 'success',
                    message: 'Order deleted successfully',
                };
            }
            else {
                throw new common_1.BadRequestException();
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async createOrder(request, createOrderDto) {
        try {
            const user = request['guardUser'];
            const supported = await this.coinsService.getOneSupportedCoin({
                id: createOrderDto.supported_coin_id,
            });
            const myCoin = await this.coinsService.findOneCoin({
                userId: user.id,
                supported_coin_id: createOrderDto.supported_coin_id,
            });
            let wallet = null;
            if (createOrderDto.buy_type === 1 && supported) {
                if (!myCoin) {
                    wallet = await this.currencies.getWallet(supported.type);
                    console.log('wallet', wallet);
                    await this.coinsService.addMyCoin({
                        amount: 0,
                        userId: user.id,
                        supported_coin_id: createOrderDto.supported_coin_id,
                        private_key: wallet.privateKey,
                        address: wallet.address,
                    });
                }
            }
            if (createOrderDto.buy_type === 2 &&
                supported &&
                (!myCoin ||
                    (myCoin && parseFloat(myCoin.amount) - createOrderDto.amount < 0) ||
                    !(createOrderDto.bank_name && createOrderDto.account_number))) {
                return new common_1.BadRequestException('Bad Request');
            }
            if ((supported && myCoin && myCoin.address) ||
                (supported && wallet && wallet.address)) {
                const address = createOrderDto.buy_type === 1 && supported && myCoin && myCoin.address
                    ? myCoin.address
                    : wallet.address;
                const data = await this.ordersService.createOrder(Object.assign(Object.assign({}, createOrderDto), { userId: user.id, address: address }));
                await this.notificationsService.createNotifications({
                    userId: 1,
                    type: 'order',
                    description: `Your request to ${createOrderDto.buy_type === 1 ? 'buy' : 'sell'} ${createOrderDto.amount} ${supported.type.toUpperCase()} was posted on the Canza Market Place.`,
                    metadata: JSON.stringify(Object.assign(Object.assign({}, createOrderDto), { resolved_status: 'created' })),
                });
                return {
                    status: 'success',
                    message: 'Order created successfully',
                    data: data,
                };
            }
            else {
                return new common_1.BadRequestException('Bad request. Check and try again.');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async userInitiated(request, id) {
        try {
            const user = request['guardUser'];
            const order = await this.ordersService.getAnOrder({
                userId: user.id,
                id: id,
            });
            if (order &&
                order.resolved_by &&
                order.resolved_status === 'pending' &&
                order.buy_type === 1) {
                await this.ordersService.updateMyOrder({
                    id: id,
                }, {
                    resolved_status: 'initiated',
                });
                return {
                    status: 'success',
                    message: 'Order has been initiated',
                };
            }
            else {
                return new common_1.BadRequestException('Bad Request');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async agentInitiated(id) {
        try {
            const order = await this.ordersService.getAnOrder({
                id: id,
            });
            if (order &&
                order.resolved_by &&
                order.resolved_status === 'pending' &&
                order.buy_type === 2) {
                await this.ordersService.updateMyOrder({
                    id: id,
                }, {
                    resolved_status: 'initiated',
                });
                return {
                    status: 'success',
                    message: 'Order has been initiated',
                };
            }
            else {
                return new common_1.BadRequestException('Bad Request');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
};
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, orders_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateMyOrder", null);
__decorate([
    (0, common_1.Put)('/:id/resolved'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "resolveOrder", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "deleteMyOrder", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, orders_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)('user/initiated/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "userInitiated", null);
__decorate([
    (0, common_1.Put)('agent/initiated/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "agentInitiated", null);
OrdersController = __decorate([
    (0, common_1.Controller)(`${helpers_1.API_VERSION}orders`),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        orders_service_1.OrdersService,
        coins_service_1.CoinsService,
        notifications_service_1.NotificationsService,
        currencies_1.Currencies])
], OrdersController);
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map