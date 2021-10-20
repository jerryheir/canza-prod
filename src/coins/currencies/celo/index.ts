import { newKit } from '@celo/contractkit';
import { SendArguments } from '../../../interfaces';

// Remotely connect to the Alfajores testnet
// const kit = newKit('https://alfajores-forno.celo-testnet.org');
const kit = newKit(
  'https://mainnet.infura.io/v3/2fbee4f58b244fe6b189717c02780673',
);

export class Celo {
  async getCeloAccounts() {
    try {
      const result = kit.contracts.getAccounts();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async encryptCeloPrivateKey(privateKey, password): Promise<any> {
    try {
      const result = kit.web3.eth.accounts.encrypt(privateKey, password);
      console.log(result);
      // return JSON.stringify(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async decryptCeloPrivateKey(json, password): Promise<any> {
    // const privateKey = JSON.parse(json);
    try {
      const privateKey = json;
      const result = kit.web3.eth.accounts.decrypt(privateKey, password);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  generateCusdAddress(): { privateKey: string; address: string } {
    try {
      const result = kit.web3.eth.accounts.create();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async sendCusd(object: SendArguments) {
    try {
      const stableToken = await kit.contracts.getStableToken();
      const cUSDtx = await stableToken
        .transfer(object.to, object.amount)
        .send({ from: object.from, feeCurrency: stableToken.address });
      const cUSDReceipt = await cUSDtx.waitReceipt();
      console.log('cUSDReceipt', cUSDReceipt);
    } catch (err) {
      console.log(err);
    }
  }
  async getCusdBalance(address: string) {
    try {
      const stableToken = await kit.contracts.getStableToken();
      const cusdBalance = await stableToken.balanceOf(address);
      console.log('balance', cusdBalance, 'stableToken.address', stableToken);
      return cusdBalance.toString();
    } catch (err) {
      console.log(err);
    }
  }
}
