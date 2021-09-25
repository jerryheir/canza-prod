import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
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
import { Currency, responseData } from '../interfaces';
import { RolesGuard } from '../roles.guard';
import { CoinsService } from './coins.service';
import {
  // CoinsDto,
  CreateSwapDto,
  SendCoinDto,
  SupportedCoinsDto,
} from './dto/coins.dto';

@Controller(`${API_VERSION}coins`)
export class CoinsController {
  constructor(
    private readonly coinsService: CoinsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('me')
  @UseGuards(RolesGuard)
  async getCoins(
    @Req() request: Request,
    @Query('currency') currency: string,
  ): Promise<responseData> {
    try {
      const c = currency.split(',');
      const user = request['guardUser'];
      const curr = c && c.length > 0 ? c : ['ngn'];
      const my_coins = await this.coinsService.findMyCoins({ userId: user.id });
      const supported_coins = await this.coinsService.findSupportedCoinsAll(
        curr,
      );
      const data = my_coins.map((item) => {
        const sup = supported_coins.find(
          (a) => a.id === item.supported_coin_id,
        );
        return {
          ...sup,
          ...item,
        };
      });
      console.log('BEFORE return getCoins', data);
      return {
        status: 'success',
        message: 'All Supported Coins',
        data: data,
      };
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Get('swap-rate/:primary')
  @UseGuards(RolesGuard)
  async getSwapRate(
    @Param() primary: string,
    @Query('coins') coins: string,
  ): Promise<responseData> {
    try {
      const c = coins.split(',');
      const data = await this.coinsService.getSwapRate(primary, c);
      return {
        status: 'success',
        message: 'Swap rates returned successfully',
        data: data,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('currencies')
  @UseGuards(RolesGuard)
  async getCoinGeckoCurrencies(): Promise<responseData> {
    try {
      const data = await this.coinsService.getCoinGeckoCurrencies();
      return {
        status: 'success',
        message: 'Currency formats returned successfully',
        data: data,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  // @Put('set/:supported_coin_id')
  // @UseGuards(RolesGuard)
  // async setAsset(
  //   @Req() request: Request,
  //   @Param('supported_coin_id') supported_coin_id: number,
  //   @Body() supportedCoins: CoinsDto,
  // ): Promise<responseData> {
  //   try {
  //     const user = request['guardUser'];
  //     const coin = await this.coinsService.findOneCoin({
  //       userId: user.id,
  //       supported_coin_id: supported_coin_id,
  //     });
  //     if (coin) {
  //       await this.coinsService.updateMyCoin(coin.id, {
  //         amount: coin.amount + supportedCoins.amount,
  //       });
  //       return {
  //         status: 'success',
  //         message: 'Coin updated successfully!',
  //       };
  //     } else {
  //       await this.coinsService.addMyCoin({
  //         ...supportedCoins,
  //         userId: user.id,
  //         supported_coin_id: supported_coin_id,
  //       });
  //       return {
  //         status: 'success',
  //         message: 'Coin successfully added!',
  //       };
  //     }
  //   } catch (err) {
  //     throw new UnauthorizedException('Unauthorized');
  //   }
  // }

  @Get()
  @UseGuards(RolesGuard)
  async getSupportedCoins(
    @Query('currency') currency: string,
  ): Promise<responseData> {
    try {
      const c = currency.split(',');
      const curr = c && c.length > 0 ? c : ['ngn', 'usd', 'gbp'];
      const data = await this.coinsService.findSupportedCoinsAll(curr);
      return {
        status: 'success',
        message: 'All Supported Coins',
        data: data,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('create')
  @UseGuards(RolesGuard)
  async createSupportedCoins(
    @Req() request: Request,
    @Body() supportedCoins: SupportedCoinsDto,
  ): Promise<responseData> {
    try {
      const user = request['guardUser'];
      if (user.role && user.role > 2) {
        await this.coinsService.createSupportedCoin(supportedCoins);
        return {
          status: 'success',
          message: 'Coin successfully added!',
        };
      }
      throw new UnauthorizedException('Unauthorized');
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Put('update/:supported_coin_id')
  @UseGuards(RolesGuard)
  async updateSupportedCoins(
    @Req() request: Request,
    @Param('supported_coin_id') supported_coin_id: number,
    @Body() supportedCoins: SupportedCoinsDto,
  ): Promise<responseData> {
    try {
      const user = request['guardUser'];
      if (user.role && user.role > 2) {
        await this.coinsService.updateSupportedCoin(
          supported_coin_id,
          supportedCoins,
        );
        return {
          status: 'success',
          message: 'Coin updated successfully!',
        };
      }
      throw new UnauthorizedException('Unauthorized');
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Put('request-swap')
  @UseGuards(RolesGuard)
  async requestSwapToken(
    @Req() request: Request,
    @Body() createSwapDto: CreateSwapDto,
  ): Promise<responseData> {
    try {
      const user = request['guardUser'];
      if (createSwapDto.from === createSwapDto.to)
        throw new BadRequestException();
      const coin = await this.coinsService.findOneCoin({
        userId: user.id,
        supported_coin_id: createSwapDto.from,
      });
      if (
        coin &&
        coin.amount &&
        coin.amount -
          createSwapDto.amount -
          createSwapDto.amount * 0 /*0.01*/ >=
          0 // 2 btc - 1 btc - 0.01 fee >= 0
      ) {
        const other = await this.coinsService.findOneCoin({
          userId: user.id,
          supported_coin_id: createSwapDto.to,
        });
        const supported = await this.coinsService.getOneSupportedCoin(
          createSwapDto.from,
        );
        const otherSupported = await this.coinsService.getOneSupportedCoin(
          createSwapDto.to,
        );
        const swapRate = await this.coinsService.getSwapRate(
          supported.coin_name,
          [otherSupported.type],
        );
        const rate =
          swapRate.find((a) => a.currency === otherSupported.type).value *
          createSwapDto.amount;
        await this.coinsService.updateMyCoin(coin.id, {
          amount:
            coin.amount -
            createSwapDto.amount -
            createSwapDto.amount * 0 /*0.01*/,
        });
        if (other) {
          const updatedResult = await this.coinsService.updateMyCoin(other.id, {
            amount: other.amount + rate,
          });
          await this.notificationsService.createNotifications({
            userId: 1,
            type: 'swap',
            description: `You have successfully swapped ${
              createSwapDto.from
            } ${supported.type.toUpperCase()} to ${rate} ${otherSupported.type.toUpperCase()}`,
            metadata: JSON.stringify({ ...updatedResult }),
          });
          return {
            status: 'success',
            message: 'Swap completed successfully',
            data: updatedResult.generatedMaps.find((a) => a.id, other.id),
          };
        } else {
          const updatedResult = await this.coinsService.addMyCoin({
            amount: rate,
            userId: user.id,
            supported_coin_id: createSwapDto.to,
          });
          await this.notificationsService.createNotifications({
            userId: 1,
            type: 'swap',
            description: `You have successfully swapped ${
              createSwapDto.amount
            } ${supported.type.toUpperCase()} to ${rate} ${otherSupported.type.toUpperCase()}`,
            metadata: JSON.stringify({ ...updatedResult }),
          });
          return {
            status: 'success',
            message: 'Swap completed successfully',
            data: updatedResult.generatedMaps.find((a) => a.id, other.id),
          };
        }
      }
      return {
        status: 'error',
        message:
          'Something went wrong. Please check your canza wallet and try again',
      };
    } catch (err) {
      throw new InternalServerErrorException('An error occurred!');
    }
  }

  @Post('send/:id')
  @UseGuards(RolesGuard)
  async sendCoin(
    @Req() request: Request,
    @Param('id') contact_id: number,
    @Body() sendCoin: SendCoinDto,
  ): Promise<responseData> {
    try {
      const user = request['guardUser'];
      const myCoin = await this.coinsService.findOneCoin({
        userId: user.id,
        supported_coin_id: sendCoin.supported_coin_id,
      });
      const otherCoin = await this.coinsService.findOneCoin({
        userId: contact_id,
        supported_coin_id: sendCoin.supported_coin_id,
      });
      if (!myCoin || (myCoin && myCoin.amount < sendCoin.amount)) {
        throw new BadRequestException(
          'Insufficient assets. Check your assets and try again',
        );
      }
      if (otherCoin) {
        await this.coinsService.updateMyCoin(otherCoin.id, {
          amount: otherCoin.amount + sendCoin.amount,
        });
      } else {
        await this.coinsService.addMyCoin({
          ...sendCoin,
          userId: contact_id,
        });
      }
      return {
        status: 'success',
        message: `Asset sent successfully`,
      };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
