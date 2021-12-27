"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ethereum = void 0;
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/2fbee4f58b244fe6b189717c02780673');
class Ethereum {
    async getEthAccounts() {
        try {
            const result = await web3.eth.getAccounts();
            console.log(result);
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    async encryptEthPrivateKey(privateKey, password) {
        try {
            const result = web3.eth.accounts.encrypt(privateKey, password);
            console.log(result);
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    async decryptEthPrivateKey(json, password) {
        try {
            const privateKey = json;
            const result = web3.eth.accounts.decrypt(privateKey, password);
            console.log(result);
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    generateEthereumAddress() {
        try {
            const result = web3.eth.accounts.create();
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    async sendEthereum(object) {
        try {
            const tx = await web3.eth.accounts.signTransaction({
                from: object.from,
                to: object.to,
                value: object.amount,
                chain: 'rinkeby',
            }, object.privateKey, (error) => {
                console.log('SEND ETH ERROR', error);
            });
            const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
            console.log('Transaction Hash', receipt.transactionHash);
            return tx;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getEthereumBalance(address) {
        try {
            const balance = await web3.eth.getBalance(address);
            return balance;
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.Ethereum = Ethereum;
//# sourceMappingURL=index.js.map