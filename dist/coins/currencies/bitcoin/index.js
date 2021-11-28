"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitcoin = void 0;
const bitcore = require('bitcore-lib');
const Insight = require('bitcore-insight').Insight;
const insight = new Insight('https://explorer.btc.zelcore.io');
const axios_1 = require("axios");
class Bitcoin {
    generateBitcoinAddress() {
        const random = bitcore.crypto.Random.getRandomBuffer(32);
        const key = bitcore.crypto.BN.fromBuffer(random);
        const p = new bitcore.PrivateKey(key);
        const address = p.toAddress();
        const privateKey = p.toWIF();
        console.log({ privateKey: privateKey, address: address.toString() });
        return { privateKey: privateKey, address: address.toString() };
    }
    async sendBitcoin(object) {
        const privateKey = bitcore.PrivateKey.fromWIF(object.privateKey);
        const satoshis = parseInt((parseFloat(object.amount) * 100000000).toFixed(0));
        if (satoshis < 15000)
            return { error: 'Balance too small' };
        const txId = insight.getUtxos(object.from, (err, utxos) => {
            if (err) {
                console.log('SEND_BTC', err);
            }
            else {
                console.log('UTXOS', satoshis, utxos);
                const tx = bitcore.Transaction();
                tx.from(utxos);
                tx.to(object.to, satoshis);
                tx.change('18whDyhMyewqKvEG1Gs9jqYUvvhyRS1m4d');
                tx.sign(privateKey);
                tx.serialize();
                const txId = insight.broadcast(tx.toString(), (err, returnedTxId) => {
                    if (err) {
                        console.log('BROADCAST ERROR', err);
                    }
                    else {
                        console.log('SUCCESSFUL TRANSACTION', returnedTxId);
                        return returnedTxId;
                    }
                });
                return txId;
            }
        });
        return txId;
    }
    async verifyTransaction(object) {
        const data = await axios_1.default.get(`https://api.blockcypher.com/v1/btc/main/addrs/${object.address}?limit=4`);
        const txrefs = data.data.txrefs.find((item) => item.tx_hash === object.txId);
        if (txrefs &&
            txrefs.confirmations > 2) {
            return true;
        }
        else {
            return false;
        }
    }
    async getBitcoinBalance(address) {
        try {
            const data = await axios_1.default.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`);
            console.log('DATA BALANCE', data.data);
            const balance = data.data.balance;
            const convertFromSatoshi = balance / 100000000;
            return convertFromSatoshi;
        }
        catch (err) {
            console.log('Bitcoin Balance Error: ', err);
        }
    }
}
exports.Bitcoin = Bitcoin;
//# sourceMappingURL=index.js.map