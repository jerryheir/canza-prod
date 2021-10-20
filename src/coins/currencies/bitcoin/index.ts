/* eslint-disable @typescript-eslint/no-var-requires */
const bitcore = require('bitcore-lib');
const bitcoinTransaction = require('bitcoin-transaction');
import axios from 'axios';
// import moment from 'moment';
import { SendArguments } from '../../../interfaces';

export class Bitcoin {
  generateBitcoinAddress() {
    const random = bitcore.crypto.Random.getRandomBuffer(32);
    const key = bitcore.crypto.BN.fromBuffer(random);
    const p = new bitcore.PrivateKey(key);
    // const p = new bitcore.PrivateKey(key, 'testnet');
    const address = p.toAddress();
    const privateKey = p.toWIF();
    console.log({ privateKey: privateKey, address: address.toString() });
    return { privateKey: privateKey, address: address.toString() };
  }
  async sendBitcoin(object: SendArguments) {
    const tx = await bitcoinTransaction.sendTransaction({
      from: object.from,
      to: object.to,
      privKeyWIF: object.privateKey,
      btc: object.amount,
      network: 'testnet',
      minConfirmations: 2,
    });
    console.log('BTC TX', tx);
  }
  async verifyTransaction(object: { address: string; txId: string }) {
    const data = await axios.get(
      `https://api.blockcypher.com/v1/btc/main/addrs/${object.address}?limit=4`,
    );
    const txrefs = data.data.txrefs.find(
      (item) => item.tx_hash === object.txId,
    );
    if (
      txrefs &&
      txrefs.confirmations > 2
      // && moment(txrefs.confirmed).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')
    ) {
      // may need to change this validtion
      return true;
    } else {
      return false;
    }
  }
  async getBitcoinBalance(address: string) {
    try {
      // const balance = await bitcoinTransaction.getBalance(address, {
      //   network: 'mainnet',
      // });
      // return balance;
      // https://api.blockcypher.com/v1/btc/main/addrs/1oi9BgdZ4Uoa4wuy7NsnDpXbGo5qrY3Vh/balance
      const data = await axios.get(
        `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
      );
      console.log('DATA BALANCE', data.data);
      const balance = data.data.balance;
      const convertFromSatoshi = balance / 100000000;
      return convertFromSatoshi;
    } catch (err) {
      console.log('Bitcoin Balance Error: ', err);
    }
  }
}
