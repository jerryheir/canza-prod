import { SendArguments } from '../../../interfaces';
export declare class Celo {
    getCeloAccounts(): Promise<import("@celo/contractkit/lib/wrappers/Accounts").AccountsWrapper>;
    encryptCeloPrivateKey(privateKey: any, password: any): Promise<any>;
    decryptCeloPrivateKey(json: any, password: any): Promise<any>;
    generateCusdAddress(): {
        privateKey: string;
        address: string;
    };
    sendCusd(object: SendArguments): Promise<void>;
    getCusdBalance(address: string): Promise<string>;
}
