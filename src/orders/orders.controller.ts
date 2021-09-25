import {
  Controller,
  Get,
  Post,
  Put,
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

@Controller(`${API_VERSION}orders`)
export class OrdersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly coinsService: CoinsService,
    private readonly notificationsService: NotificationsService,
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
  ): Promise<responseData> {
    try {
      const order = await this.ordersService.getAnOrder({ id: id });
      const supported = await this.coinsService.getOneSupportedCoin({
        id: order.supported_coin_id,
      });
      if (
        order &&
        updateOrderDto &&
        updateOrderDto.resolved_by &&
        !order.resolved_by
      ) {
        const resolvingUser = await this.usersService.findOne({
          id: updateOrderDto.resolved_by,
        });
        if (resolvingUser) {
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
            userId: 1,
            type: 'order',
            description: `Your order to ${
              order.buy_type === 1 ? 'buy' : 'sell'
            } ${
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
        } else {
          throw new BadRequestException();
        }
      } else {
        throw new BadRequestException();
      }
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
      const supported = await this.coinsService.getOneSupportedCoin({
        id: order.supported_coin_id,
      });
      if (order) {
        await this.ordersService.updateMyOrder(
          {
            id: id,
          },
          {
            resolved_status: 'completed',
          },
        );
        await this.notificationsService.createNotifications({
          userId: 1,
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
      /*const swapRate = await this.coinsService.getSwapRate(
        supported.coin_name,
        ['ngn'],
      );
      const rate =
        swapRate.find((a) => a.currency === 'ngn').value *
        createOrderDto.amount;*/
      if (createOrderDto.buy_type === 1) {
        if (user.wallet_balance - createOrderDto.request_amount < 0) {
          return new BadRequestException(
            'Insufficient funds. Fund your wallet and try again.',
          );
        }
        await this.usersService.findAndUpdate(
          {
            id: user.id,
          },
          {
            wallet_balance:
              user.wallet_balance - createOrderDto.request_amount >= 0
                ? user.wallet_balance - createOrderDto.request_amount
                : user.wallet_balance,
          },
        );
      }
      if (createOrderDto.buy_type === 2) {
        const myCoin = await this.coinsService.findOneCoin({
          userId: user.id,
          supported_coin_id: createOrderDto.supported_coin_id,
        });
        if (
          myCoin.amount - createOrderDto.amount <
          0 /* Subtract the percentage for fee also */
        ) {
          return new BadRequestException(
            'Insufficient assets. Check your assets and try again.',
          );
        }
        await this.coinsService.updateMyCoin(myCoin.id, {
          amount:
            myCoin.amount -
            createOrderDto.amount /* Subtract the percentage for fee also */,
        });
      }
      const data = await this.ordersService.createOrder({
        ...createOrderDto,
        userId: user.id,
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
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An error occurred!');
    }
  }
}
