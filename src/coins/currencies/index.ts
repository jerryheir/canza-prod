import { Bitcoin } from './bitcoin';
import { Ethereum } from './ethereum';
import { Celo } from './celo';
import { SendArguments, Supported } from '../../interfaces';

const btc = new Bitcoin();
const eth = new Ethereum();
const cusd = new Celo();

export class Currencies {
  async getWallet(a: Supported) {
    const wallet = {
      btc: btc.generateBitcoinAddress,
      eth: eth.generateEthereumAddress,
      cusd: cusd.generateCusdAddress,
    };
    const result = await wallet[a]();
    return result;
  }
  async sendCrypto(a: Supported, object: SendArguments) {
    const send = {
      btc: btc.sendBitcoin,
      eth: eth.sendEthereum,
      cusd: cusd.sendCusd,
    };
    const result = await send[a](object);
    return result;
  }
  async getBalance(a: Supported, address: string) {
    const balance = {
      btc: btc.getBitcoinBalance,
      eth: eth.getEthereumBalance,
      cusd: cusd.getCusdBalance,
    };
    const result = await balance[a](address);
    return result;
  }
}
