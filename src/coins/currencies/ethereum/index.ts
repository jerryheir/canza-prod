import { SendArguments } from '../../../interfaces';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

// const web3 = new Web3(
//   'https://rinkeby.infura.io/v3/2fbee4f58b244fe6b189717c02780673',
// );
const web3 = new Web3(
  'https://mainnet.infura.io/v3/2fbee4f58b244fe6b189717c02780673',
);
// web3.setProvider('ws://localhost:8000');

export class Ethereum {
  async getEthAccounts() {
    try {
      const result = await web3.eth.getAccounts();
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async encryptEthPrivateKey(privateKey, password): Promise<any> {
    try {
      const result = web3.eth.accounts.encrypt(privateKey, password);
      console.log(result);
      // return JSON.stringify(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async decryptEthPrivateKey(json, password): Promise<any> {
    // const privateKey = JSON.parse(json);
    try {
      const privateKey = json;
      const result = web3.eth.accounts.decrypt(privateKey, password);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  generateEthereumAddress(): { privateKey: string; address: string } {
    try {
      const result = web3.eth.accounts.create();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async sendEthereum(object: SendArguments): Promise<any> {
    try {
      // const gasPrice = await web3.eth.getGasPrice();
      const tx = await web3.eth.accounts.signTransaction(
        {
          from: object.from,
          to: object.to,
          // gasPrice: gasPrice,
          value: object.amount,
          chain: 'rinkeby',
        },
        object.privateKey,
        (error) => {
          console.log('SEND ETH ERROR', error);
        },
      );
      const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
      console.log('Transaction Hash', receipt.transactionHash);
      return tx;
    } catch (err) {
      console.log(err);
    }
  }
  async getEthereumBalance(address: string): Promise<any> {
    try {
      const balance = await web3.eth.getBalance(address);
      return balance;
    } catch (err) {
      console.log(err);
    }
  }
}
