import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  InternalServerErrorException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { API_VERSION } from '../helpers';
import { responseData } from '../interfaces';
import { RolesGuard } from '../roles.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { CoinsService } from '../coins/coins.service';
import { Currencies } from '../coins/currencies';

@Controller(`${API_VERSION}orders`)
export class OrdersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly coinsService: CoinsService,
    private readonly notificationsService: NotificationsService,
    private readonly currencies: Currencies,
  ) {}

  @Get('me')
  @UseGuards(RolesGuard)
  async getMyOrders(@Req() request: Request): Promise<responseData> {
    try {
      const user = request['guardUser'];
      const data = await this.ordersService.getAllOrders({ userId: user.id });
      return {
        status: 'success',
        message: 'Orders retrieved successfully',
        data: data,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Get('')
  @UseGuards(RolesGuard)
  async getAllOrders(@Req() request: Request): Promise<responseData> {
    try {
      const user = request['guardUser'];
      if (user.role && user.role > 2) {
        const data = await this.ordersService.getAllOrders();
        return {
          status: 'success',
          message: 'Orders retrieved successfully',
          data: data,
        };
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Put('/:id')
  @UseGuards(RolesGuard)
  async updateMyOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const order = await this.ordersService.getAnOrder({ id: id });
      if (order.buy_type === 1 && updateOrderDto.address) {
        return new BadRequestException('Bad Request');
      }
      if (
        order.buy_type === 2 &&
        (!updateOrderDto.agent_address ||
          updateOrderDto.bank_name ||
          updateOrderDto.account_number)
      ) {
        return new BadRequestException('Bad Request');
      }
      const supported = await this.coinsService.getOneSupportedCoin({
        id: order.supported_coin_id,
      });
      const resolvingUser = await this.usersService.findOne({
        id: updateOrderDto.resolved_by,
      });
      await this.ordersService.updateMyOrder(
        {
          id: id,
        },
        {
          ...updateOrderDto,
          resolved_status: 'pending',
        },
      );
      await this.notificationsService.createNotifications({
        userId: order.userId,
        type: 'order',
        description: `Your order to ${order.buy_type === 1 ? 'buy' : 'sell'} ${
          order.amount
        } ${supported.type.toUpperCase()} has been accepted by ${
          resolvingUser.firstname
        } ${resolvingUser.lastname}.`,
        metadata: JSON.stringify({ ...order, resolved_status: 'pending' }),
      });
      return {
        status: 'success',
        message: 'Order updated successfully',
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Put('/:id/resolved')
  @UseGuards(RolesGuard)
  async resolveOrder(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<responseData> {
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
        } else {
          await this.coinsService.addMyCoin({
            amount: order.amount,
            userId: order.userId,
            supported_coin_id: order.supported_coin_id,
          });
        }
        await this.ordersService.updateMyOrder(
          {
            id: id,
          },
          {
            resolved_status: 'completed',
          },
        );
        await this.notificationsService.createNotifications({
          userId: order.userId,
          type: 'order',
          description: `Your order to ${
            order.buy_type === 1 ? 'buy' : 'sell'
          } ${
            order.amount
          } ${supported.type.toUpperCase()} has been completed.`,
          metadata: JSON.stringify({ ...order, resolved_status: 'completed' }),
        });
        return {
          status: 'success',
          message: 'Order resolved successfully',
        };
      } else {
        throw new BadRequestException();
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Delete('/:id')
  @UseGuards(RolesGuard)
  async deleteMyOrder(@Param('id') id: number): Promise<responseData> {
    try {
      const order = await this.ordersService.getAnOrder({ id: id });
      if (order && !order.resolved_by && order.resolved_status === 'created') {
        await this.ordersService.deleteMyOrder({ id: id });
        return {
          status: 'success',
          message: 'Order deleted successfully',
        };
      } else {
        throw new BadRequestException();
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Post('create')
  @UseGuards(RolesGuard)
  async createOrder(
    @Req() request: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      const user: User = request['guardUser'];
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
      if (
        createOrderDto.buy_type === 2 &&
        supported &&
        (!myCoin ||
          (myCoin && parseFloat(myCoin.amount) - createOrderDto.amount < 0) ||
          !(createOrderDto.bank_name && createOrderDto.account_number))
      ) {
        return new BadRequestException('Bad Request');
      }
      if (
        (supported && myCoin && myCoin.address) ||
        (supported && wallet && wallet.address)
      ) {
        const address =
          createOrderDto.buy_type === 1 && supported && myCoin && myCoin.address
            ? myCoin.address
            : wallet.address;
        const data = await this.ordersService.createOrder({
          ...createOrderDto,
          userId: user.id,
          address: address,
        });
        await this.notificationsService.createNotifications({
          userId: 1,
          type: 'order',
          description: `Your request to ${
            createOrderDto.buy_type === 1 ? 'buy' : 'sell'
          } ${
            createOrderDto.amount
          } ${supported.type.toUpperCase()} was posted on the Canza Market Place.`,
          metadata: JSON.stringify({
            ...createOrderDto,
            resolved_status: 'created',
          }),
        });
        return {
          status: 'success',
          message: 'Order created successfully',
          data: data,
        };
      } else {
        return new BadRequestException('Bad request. Check and try again.');
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Put('user/initiated/:id')
  @UseGuards(RolesGuard)
  async userInitiated(@Req() request: Request, @Param('id') id: number) {
    try {
      const user = request['guardUser'];
      const order = await this.ordersService.getAnOrder({
        userId: user.id,
        id: id,
      });
      if (
        order &&
        order.resolved_by &&
        order.resolved_status === 'pending' &&
        order.buy_type === 1
      ) {
        await this.ordersService.updateMyOrder(
          {
            id: id,
          },
          {
            resolved_status: 'initiated',
          },
        );
        return {
          status: 'success',
          message: 'Order has been initiated',
        };
      } else {
        return new BadRequestException('Bad Request');
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Put('agent/initiated/:id')
  @UseGuards(RolesGuard)
  async agentInitiated(@Param('id') id: number) {
    try {
      const order = await this.ordersService.getAnOrder({
        id: id,
      });
      if (
        order &&
        order.resolved_by &&
        order.resolved_status === 'pending' &&
        order.buy_type === 2
      ) {
        await this.ordersService.updateMyOrder(
          {
            id: id,
          },
          {
            resolved_status: 'initiated',
          },
        );
        return {
          status: 'success',
          message: 'Order has been initiated',
        };
      } else {
        return new BadRequestException('Bad Request');
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }
}
