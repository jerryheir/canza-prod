import { SendArguments } from '../../../interfaces';
export declare class Ethereum {
    getEthAccounts(): Promise<any>;
    encryptEthPrivateKey(privateKey: any, password: any): Promise<any>;
    decryptEthPrivateKey(json: any, password: any): Promise<any>;
    generateEthereumAddress(): {
        privateKey: string;
        address: string;
    };
    sendEthereum(object: SendArguments): Promise<any>;
    getEthereumBalance(address: string): Promise<any>;
}
