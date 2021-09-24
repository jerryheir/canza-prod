import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Coins, SupportedCoins } from './coins.entity';
import { Currency } from '../interfaces';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coins)
    private readonly coinsRepository: Repository<Coins>,
    @InjectRepository(SupportedCoins)
    private readonly supCoinsRepository: Repository<SupportedCoins>,
  ) {}

  async findSupportedCoinsAll(currency: string[]): Promise<any[]> {
    const supported_coins = await this.supCoinsRepository.find();
    const sup_coins = [
      ...new Set(supported_coins.map((item) => item.coin_name)),
    ].join('%2C');
    const curr = currency.join('%2C');
    const info = await axios(
      `${COINGECKO_BASE_URL}simple/price?ids=${sup_coins}&vs_currencies=${curr}&include_24hr_change=true`,
    ).then((res) => res.data);
    /*const data = await Promise.all(
      supported_coins.map(async (item) => {
        const info = await axios(
          `${COINGECKO_BASE_URL}simple/price?ids=${item.coin_name}&vs_currencies=${currency}&include_24hr_change=true`,
        ).then((res) => res.data);
        return {
          ...item,
          info: info,
        };
      }),
    );*/
    Logger.log('findSupportedCoinsAll', info);
    const data = supported_coins
      .map((item) => {
        const value = info[item.coin_name];
        if (value) {
          const prices = Object.keys(value).map((a: Currency) => {
            return {
              currency: a,
              value: value[a],
              change_24hr: value[`${a}_24h_change`],
            };
          });
          return {
            ...item,
            prices: prices,
          };
        }
      })
      .filter((a) => a);
    return data;
  }

  async getSwapRate(
    primary: string,
    coins: string[],
  ): Promise<Array<{ currency: string; value: number }>> {
    const curr = coins.join('%2C');
    const info = await axios(
      `${COINGECKO_BASE_URL}simple/price?ids=${primary}&vs_currencies=${curr}`,
    ).then((res) => res.data);
    const value = info[primary];
    const data = Object.keys(value).map((a: Currency) => {
      return {
        currency: a,
        value: value[a],
      };
    });
    return data;
  }

  async getCoinGeckoCurrencies(): Promise<any> {
    const data = await axios(
      `${COINGECKO_BASE_URL}simple/supported_vs_currencies`,
    ).then((res) => res.data);
    return data;
  }

  async findMyCoins(object: any): Promise<Coins[]> {
    return await this.coinsRepository.find(object);
  }

  async findOneCoin(object: any): Promise<Coins> {
    return await this.coinsRepository.findOne(object);
  }

  async createSupportedCoin(object: any): Promise<Coins[]> {
    return await this.supCoinsRepository.save(object);
  }

  async updateSupportedCoin(supported_coin_id: number, object: any) {
    await this.supCoinsRepository.update(
      {
        id: supported_coin_id,
      },
      object,
    );
  }

  async getOneSupportedCoin(id: number) {
    return await this.supCoinsRepository.findOne({ id: id });
  }

  async addMyCoin(object: any) {
    return await this.supCoinsRepository.save(object);
  }

  async updateMyCoin(coin_id: number, object: any) {
    return await this.supCoinsRepository.update(
      {
        id: coin_id,
      },
      object,
    );
  }
}
