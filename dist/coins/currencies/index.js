"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currencies = void 0;
const bitcoin_1 = require("./bitcoin");
const ethereum_1 = require("./ethereum");
const celo_1 = require("./celo");
const btc = new bitcoin_1.Bitcoin();
const eth = new ethereum_1.Ethereum();
const cusd = new celo_1.Celo();
class Currencies {
    async getWallet(a) {
        const wallet = {
            btc: btc.generateBitcoinAddress,
            eth: eth.generateEthereumAddress,
            cusd: cusd.generateCusdAddress,
        };
        const result = await wallet[a]();
        return result;
    }
    async sendCrypto(a, object) {
        const send = {
            btc: btc.sendBitcoin,
            eth: eth.sendEthereum,
            cusd: cusd.sendCusd,
        };
        const result = await send[a](object);
        return result;
    }
    async getBalance(a, address) {
        const balance = {
            btc: btc.getBitcoinBalance,
            eth: eth.getEthereumBalance,
            cusd: cusd.getCusdBalance,
        };
        const result = await balance[a](address);
        return result;
    }
}
exports.Currencies = Currencies;
//# sourceMappingURL=index.js.map