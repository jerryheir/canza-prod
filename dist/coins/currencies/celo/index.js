"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Celo = void 0;
const contractkit_1 = require("@celo/contractkit");
const kit = (0, contractkit_1.newKit)('https://mainnet.infura.io/v3/2fbee4f58b244fe6b189717c02780673');
class Celo {
    async getCeloAccounts() {
        try {
            const result = kit.contracts.getAccounts();
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    async encryptCeloPrivateKey(privateKey, password) {
        try {
            const result = kit.web3.eth.accounts.encrypt(privateKey, password);
            console.log(result);
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    async decryptCeloPrivateKey(json, password) {
        try {
            const privateKey = json;
            const result = kit.web3.eth.accounts.decrypt(privateKey, password);
            console.log(result);
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    generateCusdAddress() {
        try {
            const result = kit.web3.eth.accounts.create();
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
    async sendCusd(object) {
        try {
            const stableToken = await kit.contracts.getStableToken();
            const cUSDtx = await stableToken
                .transfer(object.to, object.amount)
                .send({ from: object.from, feeCurrency: stableToken.address });
            const cUSDReceipt = await cUSDtx.waitReceipt();
            console.log('cUSDReceipt', cUSDReceipt);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getCusdBalance(address) {
        try {
            const stableToken = await kit.contracts.getStableToken();
            const cusdBalance = await stableToken.balanceOf(address);
            console.log('balance', cusdBalance, 'stableToken.address', stableToken);
            return cusdBalance.toString();
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.Celo = Celo;
//# sourceMappingURL=index.js.map